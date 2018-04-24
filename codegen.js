const { spawn } = require('observable-child-process');
const GitHub = require('github-api');
const chalk = require('chalk');
const { Observable } = require('rxjs/Observable');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/observable/from');
require('rxjs/add/operator/concat');
const codgens = require('./swagger-codegen');

const { UID, GH_TOKEN } = process.env;

const createRepositoryURL = (user, repo) => `git@github.com:${user}/${repo}.git`;

const gh = new GitHub({
    token: GH_TOKEN
});
const org = 'bitcoind-rest';
const bitcoindRest = gh.getOrganization(org);

const createRepository = (name, description = '') =>
    bitcoindRest
        .createRepo({
            name,
            description,
            has_issues: false,
            has_projects: false,
            has_wiki: false
        })
        .catch((e) => console.error(chalk`{red ${e}}`))
;

const pushTo = cwd => repository => {
    return spawn('rm', ['-rf', '.git'])
        .concat(spawn('git', ['init'], { cwd }))
        .concat(spawn('git', ['config', 'user.name', 'LePetitBot'], { cwd }))
        .concat(spawn('git', ['config', 'user.email', 'bonjour@lepetitbloc.net'], { cwd }))
        .concat(spawn('git', ['add', '-A'], { cwd }))
        .concat(spawn('git', ['commit', '--allow-empty', '-m', 'update generated client'], { cwd }))
        .concat(spawn('git', ['remote', 'add', 'origin', repository], { cwd }))
        .concat(spawn('git', ['push', '-f', 'origin', 'HEAD'], { cwd }))
    ;
};

Observable
    .from(Object.keys(codgens))
    .mergeMap(
        codgen => {
            const { config, repository } = codgens[codgen];

            return spawn('docker', [
                    'run',
                    '--rm',
                    '--user',
                    UID,
                    '-v', `${__dirname}:/local`,
                    '-v', `${__dirname}/swagger.json:/opt/swagger-codegen/swagger.json`,
                    `swaggerapi/swagger-codegen-cli`,
                    'generate', '-i', '/opt/swagger-codegen/swagger.json', '-l', codgen,'-o', `/local/out/${codgen}`,
                    ...Object.keys(config).map(optionName => `-D${optionName}=${config[optionName]}`)
            ])
            .concat(createRepository(repository.name, repository.description))
            .concat(pushTo(`${__dirname}/out/${codgen}`)(createRepositoryURL(org, repository.name)))
        },
        () => {},
        1,
    )
    .subscribe()
;
