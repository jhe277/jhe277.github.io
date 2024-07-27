
# Installing and testing nginx / node server / websocket with Wsl Ubuntu

## Installing local development environment in Windows 
### with Wsl Ubuntu for nginx + node + websocket and later testing with https/wss

## 1. Modify Windows Hosts file: (probably not needed with newer wsl ubuntu releases? Can skip this unless want to use name in windows side)
in **Windows** open e.g. **Notepad** ***as Administrator*** and open file:<br />
***c:\windows\system32\drivers\etc\hosts***
<br /><br />
insert into file a new line:
```text
    my.local.dev.example.net 127.0.0.1
```

## 2. Install Wsl (Windows Subsystem for Linux - v2?)
Open **Powershell** in Windows ***as Administrator*** and run command:<br />
```powershell
wsl --install
```
and ***reboot*** after installation is ready and you are informed about restarting...<br />
Detailed instructions: [https://learn.microsoft.com/en-us/windows/wsl/install](https://learn.microsoft.com/en-us/windows/wsl/install)<br />


## 3. Open Wsl window

### 3.1. setup your default user etc stuff and then in Wsl console next steps. <br />
If you have **Windows Terminal** you should have option to launch Ubuntu from there.
```bash
Default user: <your selected username Wsl>
...
...
```
### 3.2. Modify /etc/hosts file and add next line:
```bash
...
127.0.0.1       my.local.dev.example.net
...
```


## 4. Install nginx

### 4.1. apt-get update & upgrade
```bash
sudo apt-get update && sudo apt-get upgrade
```

### 4.2. Install nginx
```bash
sudo apt-get install nginx
```

### configure some stuff in nginx or leave it as default for now - we will later make some config changes...

## 5. install latest node and npm

### 5.1. add nodejs repo
```bash
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
```

### 5.2 Install latest nodejs and npm
```bash
sudo apt-get install nodejs
```

### 5.3. Create directory for your Node server.js file and change into that directory
```bash
mkdir wsapp
cd wsapp
```

### 5.4. install websocket ws
```bash
sudo npm install ws
```

## 6. Install wscat
```bash
sudo npm install -g wscat
```

# Installing stuff is done now!

## 7. Next we will create simple WebSocket server with Node server.js
paste this code to that file and save<br /> 
Use your preferred editor, here are two examples:<br />
> [!NOTE]
> ***nano server.js*** <br />
> Ctrl-X / Y / [Enter] to save changes and exit<br /> 

> [!TIP]
> ***vim server.js*** <br />
> <**I**> to change mode, <**ESC**> to return, <:q!> exit without save, <:w> save, <:q> exit and save
```javascript
console.log("Server started - listening to 8080...");
var Msg = '';
var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 8080});
    wss.on('connection', function(ws) {
        ws.on('message', function(message) {
        console.log('Received from client: %s', message);
        ws.send('Server received from client: ' + message);
    });
 });
```

 
## 8. Start the server in own Wsl command line window

```bash
node server.js
```
this will wait for something to happen until you terminate it by pressing <**Ctrl-C**>

## 9. in another wsl command line window (open one more wsl window if you don't already have opened second window) - test websocket connection directly to node server
If you have **Windows Terminal** you should have option to launch Ubuntu from there.<br />
```bash
wscat --connect ws://my.local.dev.example.net:8080
```
Write some text and press <**ENTER**>:
```text
ws hello 1
```
stop with <**Ctrl-C**> once done<br />
You should see the text you wrote in a node server.js window and text should also be returned to your window also...

## 10. let's create some proxy configuration for websocket in nginx

modify file ***/etc/nginx/nginx.conf*** (add upstream and map definitions)<br />
You will need your ip address here, use **hostname -I** command
```nginx

...
        ##
        # Some user added websocket support settings for proxying
        ##
        map $http_upgrade $connection_upgrade {
                default upgrade;
                '' close;
        }

        upstream wsbackend {
                server <your IP address>:8080;
                # e.g. server 192.168.111.222:8080;
        }
...

```
Create new server file **example.net** into **/etc/nginx/sites-available/** directory <br />
```bash
sudo nano /etc/nginx/sites-available/example.net
```
(create example.net server settings - <br />
delete default or at least change name or delete symlink?)<br />
Add this into that file:
```nginx

    ...
    server {
            listen 8888;
            server_name example.net;

            location /wsapp/ {
                    proxy_pass http://wsbackend;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection $connection_upgrade;
                    proxy_set_header Host $host;
            }
    }
    ...

```

/etc/nginx/sites-enabled/ (create symlink to server configurations you want to enable)<br />
You will need to create symlink into **/etc/nginx/sites-enabled** -directory if you want to activate that server
```bash
sudo ln -s /etc/nginx/sites-available/example.net /etc/nginx/sites-enabled/
```

## 11. Test WebSocket through the nginx WebSocket proxy

```bash
wscat --connect ws://my.local.dev.example.net:8888/wsapp --location
```
(use --location to follow redirects)<br /><br />
Write some text and press <**ENTER**>:
```text
ws redirect hello 2
```
stop with <**Ctrl-C**> once done

# Here we are - WebSockets already working directly from Node server and through Wsl nginx proxy

## (TBD) 12. Create self-signed certificate and edit configs and test
* Create self-signed certificate for my.local.dev.example.net
* Install certificates into nginx
* test and restart nginx
* Create wss proxy for WebSocket
* (once self signed certificate etc is done you can test: 
* wscat --connect wss://my.local.dev.example.net/websocket -n)
* wss redirect hello 3
* stop with <**Ctrl-C**> once done

## installing powershell if you want...
https://learn.microsoft.com/en-us/powershell/scripting/install/install-ubuntu?view=powershell-7.4
