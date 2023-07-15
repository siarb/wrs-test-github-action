const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        const imageVersion = core.getInput('image-version');
        const instance = core.getInput('instance');
        const artifact = core.getInput('artifact');
        const workspace = process.env.GITHUB_WORKSPACE;

        const myCommands = `
            export DISPLAY=:99
            Xvfb :99 &
            /opt/builder/bin/idea.sh helpbuilderinspect -source-dir /github/workspace -product ${instance} --runner github -output-dir /github/workspace/artifacts/ || true
            echo "Test existing artifacts"
            test -e /github/workspace/artifacts/${artifact} && echo ${artifact} exists
        `;

        // Run your Docker container
        await exec.exec('docker', [
            'run',
            '--rm',
            '-v',
            `${workspace}:/github/workspace`,
            `registry.jetbrains.team/p/writerside/builder/writerside-builder:${imageVersion}`,
            '/bin/bash',
            '-c',
            myCommands
        ]);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();