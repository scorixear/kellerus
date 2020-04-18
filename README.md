# kellerus

Another Discord Bot

## Table of Contents

- [kellerus](#kellerus)
  - [Table of Contents](#table-of-contents)
  - [Set up repository for collaboration (Windows)](#set-up-repository-for-collaboration-windows)
    - [1. Download and Install Node.js](#1-download-and-install-nodejs)
    - [2. Install Windows-Build-Tools](#2-install-windows-build-tools)
    - [3. Download and Install Git](#3-download-and-install-git)
    - [4. Download FFMPEG](#4-download-ffmpeg)
    - [5. Install & Configure FFMPEG](#5-install--configure-ffmpeg)
      - [Then add FFMPEG to your Path variable:](#then-add-ffmpeg-to-your-path-variable)
      - [If Windows 10:](#if-windows-10)
      - [If older versions of Windows:](#if-older-versions-of-windows)
    - [6. Download and Install kellerus](#6-download-and-install-kellerus)
    - [7. Install Dependencies](#7-install-dependencies)
      - [Windows](#windows)
      - [Linux](#linux)
  - [Setting up kellerus](#setting-up-kellerus)
    - [Changing the Mandatory Settings](#changing-the-mandatory-settings)
      - [Discord API token](#discord-api-token)
      - [Database Setup](#database-setup)
    - [Changing the Youtube API Key](#changing-the-youtube-api-key)
    - [Changing Optional Settings](#changing-optional-settings)
    - [Setting up Puppeteer](#setting-up-puppeteer)

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

Next you'll need to download the bot and configure it. Download the `master` branch and put the unzipped files in a new folder on your computer. Next rename `config_template.json` to `config.json` and enter the correct information (more on that under [Setting up kellerus](#setting-up-kellerus)).

For obtaining a Discord Bot token, please see [this page](https://discordapp.com/developers/docs/intro).

Before running the bot you need to install the dependencies. In the folder you put the files in, Shift+Right click and select open command window here. In the command prompt type `npm install`.

The bot should now be ready! Open a command prompt like above and type `npm run start` to start the bot and see if it works.

### 7. Install Dependencies

#### Windows

Shift-RightClick in the folder that you downloaded and select Open command window here. Then type `npm install` and hit Enter.

#### Linux

cd to where you cloned the GitHub repo and type `npm install`. This will take a while.

_Credits to [bdistin/OhGodMusicBot](https://github.com/bdistin/OhGodMusicBot/blob/master/README.md#download-ffmpeg)_

--------------------------------------------

## Setting up kellerus

When deploying _Kellerus_, you need to initialize the `config.json` once! Copy the `config_template.json` from `/src/` to `/src/config.json`.
In this file, there are some mandatory and some optional settings. You need to change the mandatory settings, otherwise the Bot will **not** run.

### Changing the Mandatory Settings

The mandatory settings are `token`, `dbhost`, `dbuser`, `dbpassword` and `dbport`.

#### Discord API token

You can retrieve the token from your discord application (on https://discordapp.com/developers/applications). You need to create a separate application for this bot. Under _Bot_, click on the `Copy` button under _"Click to Reveal Token"_ and paste it in the `config.json`.

#### Database Setup

The bot **needs** a db connection. This database must be `mysql` or `mariadb`. We do not support a db-less version of this bot.
To create a database for local testing, you can use the `docker_compose.yaml` for a docker setup or create your own database by hand.
Copy the host, user, passwort and port into the `config.json`. We highly recommend to use a local database on the same instance as this bot will run.

This bot will **not** create its own database. The database must be created by you. The user the bot will use must have full access to this database, and this database only. The `dbDataBase` specifies the name of this created database.

### Changing the Youtube API Key

The bot will contact the [Youtube Data API](https://developers.google.com/youtube/v3/getting-started) provided by Google. This lets the bot search for youtube videos by given search strings. The `YoutubeApiKey` must be set in order to provide this functionality. Otherwise the Bot will spit out errors if the `queue` commmand is used with search attributes.

### Changing Optional Settings

Optional Settings are the `discordUrl`, `botPrefix`, `playPrefix`, `language` and `commands`.
These settings can be left as they are, but give you some modifiability.

- `discordUrl`, this is a preset for a possible invite link for this bot. You need to fill in the client_id. This will give the Bot every permission that it does and will need.
- `botPrefix`, this represents the single character, that will indicate a command to the bot. The message must start with this character in order to be detected as a legitimate command.
- `playPrefix`, the bot has the functionaltiy to save and play small soundfiles. These can be uploaded to the bot via the command `add` and played via `play`. Writing every time `play` is kind of tedious, this playPrefix provides a shortcut for the `play` command.
- `language`, currently the bot is translated to german and english. You can add your own translations by copying the `/src/assets/language/en-EN.json` and renaming it to you language-code. This setting can be changed while running the bot via the command `lang`.
- `commands`, this is a collection of settings, that limit the SoundFiles, that can be uploaded to the bots server. We suggest to leave them as they are, but you can fiddle with them a bit if you want.

### Setting up Puppeteer

Kellerus uses Puppeteer to retrieve current numbers of the ongoing covid19 pandemic. These numbers are retrieved via puppeteer. Running this bot in Windows is not a problem, running it on Linux or Mac require some _mandatory_ addditional packages to be installed. See the [Puppeteer on Linux](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix) repository for a detailed explanation and the dependencies that must be installed.
If the bot is not working because if puppeteer, it will almost definitly be because of missing or changed dependencies.
