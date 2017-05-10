#!/usr/bin/env node
'use strict';
/**
 * This script creates labels at github.
 * It depends on github-api and yargs packages, so make sure you have them installed
 * on the environment you are going to run this.
 * It accepts a github token or a combination of username and password for auth.
 * The token can also be provided as an environment variable.
 * To display help just run it with the -h or --help flag.
 *
 * It is used as part of the monorepo to create all the required labels, which means one label per package.
 */
const Issue = require( 'github-api/dist/components/Issue' );
const argv = require( 'yargs' )
    .usage( 'Usage: \n $0 --password [string] --label [string]' )
    .help('h')
    .alias('h', 'help')
    .alias( 'u', 'username' )
    .describe('username', 'Github username. Not required if you provide a token')
    .alias( 't', 'token' )
    .describe('token', 'Github access token. You can also provide it as a environment variable named GITHUB_TOKEN or GITHUB_AUTH')
    .alias( 'p', 'password' )
    .describe('password', 'Github password. Not required if you provide a token')
    .alias( 'l', 'label' )
    .require('label', 'Please, specify a label name')
    .describe('label', 'The label you want to create. Should not exist')
    .alias( 'r', 'repository' )
    .require('repository', 'Please, specify the target repository')
    .describe('repository', 'The repository where you want to create the label')
    .argv;

const password = argv.password;
const labelName = argv.label;
const username = argv.username;
const repository = argv.repository;
const token = argv.token || process.env.GITHUB_TOKEN || process.env.GITHUB_AUTH;

if ( (typeof password !== 'string' && typeof username !== 'string') && typeof token !== 'string' ) {
    console.error( 'Missing required arguments' );
    process.exit();
}

const auth = {
    username,
    password,
    token
};
const issue = new Issue(repository,auth);

issue.createLabel( { name: labelName, color: Math.floor( Math.random() * 16777215 ).toString( 16 ) } )
    .then(( { data } ) => {

        console.log( `Created label: ${data.name}` );
    } ).catch(( { response } ) => {

        console.error( 'Failed creating label' );
        if ( response.status === 422 ) {
            console.log( '\t Probably because the label exist already' );
        }
    } );
