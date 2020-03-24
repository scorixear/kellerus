# kellerus

Another Discord Bot

## Set up repository for collaboration (Windows)

### 1. Download and Install Node.js

Node.js is what will be used to run the bot. [Download Node.js 6.x from the website](https://nodejs.org/en/).
Open the Node.js Setup. In the options, make sure `Node.js runtime`,`npm package manager` and `Add to PATH` are enabled. After that install Node.js.

### 2. Install Windows-Build-Tools

Open up a windows powershell and run `npm i -g windows-build-tools`. This will take a while as it will download and install both python 2.7 and c++ build tools, so you can run node-gyp builds.

### 3. Download and Install Git

And install it. The website is http://git-scm.com and make sure you choose "for command prompt".

### 4. Download FFMPEG

Download FFMPEG from [this website](https://ffmpeg.zeranoe.com/builds/). Make sure to find the current Static Build for your OS Architecture (32bit/64bit).

### 5. Install & Configure FFMPEG

Extract the files to the root of your harddrive, and rename the folder to ffmpeg.

#### Then add FFMPEG to your Path variable:

1. `windows key + x`
2. go to system
3. on the left Advanced system settings
4. Environment Variables
5. under System variables find the variable **Path** hit edit

- Depending on your version of windows you may have a list of entries or a semicolon sperated field of entries.

#### If Windows 10:

1. Hit the new button on the right
2. add `c:\ffmpeg\bin`

#### If older versions of Windows:

1. add `;c:\ffmpeg\bin` to the end of the field.

### 6. Download and Install kellerus

Next you'll need to download the bot and configure it. Download the `master` branch and put the unzipped files in a new folder on your computer. Next rename `config_template.js` to `config.js` and enter the correct information.

For obtaining a Discord Bot token, please see [this page](https://discordapp.com/developers/docs/intro).

Before running the bot you need to install the dependencies. In the folder you put the files in, Shift+Right click and select open command window here. In the command prompt type `npm install`.

The bot should now be ready! Open a command prompt like above and type `npm run start` to start the bot and see if it works.

### 7. Install Dependencies

#### Windows

Shift-RightClick in the folder that you downloaded and select Open command window here. Then type `npm install` and hit Enter.

#### Linux

cd to where you cloned the GitHub repo and type `npm install`. This will take a while.

_Credits to [bdistin/OhGodMusicBot](https://github.com/bdistin/OhGodMusicBot/blob/master/README.md#download-ffmpeg)_