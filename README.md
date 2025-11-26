## Remnawave Subscription Page

Learn more about Remnawave [here](https://remna.st/).

# Contributors

Check [open issues](https://github.com/remnawave/subscription-page/issues) to help the progress of this project.

<p align="center">
Thanks to the all contributors who have helped improve Remnawave:
</p>
<p align="center">
<a href="https://github.com/remnawave/subscription-page/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=remnawave/subscription-page" />
</a>
</p>

```
scp -r subscription-page/dist/assets root@94.232.44.30:/var/lib/marzban/nexus-sub
scp -r subscription-page/dist/locales root@94.232.44.30:/var/lib/marzban/nexus-sub
scp -r subscription-page/dist/index.html root@94.232.44.30:/var/lib/marzban/templates/subscription/index.html


        handle_path /nexus-sub/* {
            root * /var/lib/marzban/nexus-sub
            file_server
        }
```
