
# Welcome to SiteInspector.js!&nbsp;&nbsp;&nbsp; [![Build status](https://siteinspector.visualstudio.com/SiteInspector/_apis/build/status/SiteInspector-Master%20build?branch=master)](https://siteinspector.visualstudio.com/SiteInspector/_build/latest?definitionId=1&branch=master)

<table>
  <tr>
    <td><img src="https://redir.blob.core.windows.net/assets/SILogoGithub.png" alt="Robot" width="620" style="float:left; margin-right:20pt"/></td>
    <td>SiteInspector.js is a framework for a lightweight pane that slides out from the side of your browser 
window and can be used to enhance any web site or portal with additional, contextual content. Use it
to display usage statistics, expose diagnostic tools, show performance analytics, or any other useful 
information to help you manage and maintain your site.</td>
  </tr>  
</table>

# Running the sample

To try out this example, clone the project and install [npm](https://github.com/npm/cli) if you don't have it already.


```sh
npm run demo
```

This will launch a test server (http://localhost:3000) with an example of the SiteInspector.JS shell embedded in the page. The small Microsoft logo tab on the left of the page can be clicked to slide out the blade framework as shown on the right.

<img src="https://redir.blob.core.windows.net/assets/GitHubSICapture.PNG">

# Building and hosting your own files

The SiteInspector framework has the ability to be hosted anywhere you chose. You can include the shell (siteinspector.JS) and tab (yourcustomertab1.js, yourcustomertab2.js) files in a folder in your website, or they can be hosted externally to your site in a blob store or another HTTP location.

To use SiteInspector on your site, all you need is to include the loader script at the top of the pages on your website. Here’s an example of a SiteInspector site using Azure blob store to hosts it’s files.


```sh
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title></title>
</head>
<body>
    <script>
            (function (d, s, si) {
                let m = d.getElementsByTagName(s)[0];
            let j = d.createElement(s);
            j.src = si; j.async = 1;
            m.parentNode.insertBefore(j, m);
                j.onload = function () {
                window.siteInspector.init({
                    title: 'SiteInspector.JS',
                    aboutUrl: 'https://github.com/microsoft/siteinspector',
                    tabs: [
                        {
                            title: 'My Custom Tab',
                            id: 'gettingstartedtab',
                            location: 'https://redir.blob.core.windows.net/assets/gettingStartedTab.js',
                        }
                    ],
                });
            };
        })(document, "script", "https://redir.blob.core.windows.net/assets/siteinspector.js");
    </script>
    <h2>Test Host Website</h2>
</body>
</html>
```
To generate the shell, navigate to the [src/SiteInspector](src/SiteInspector) folder and run the following npm command.

```sh
npm run build
```

This will output a SiteInspector.js file in the ./dist folder.

Next, you'll need to build the tabs in a similar fashion. 

For instructions on writing your own customer tabs, see the doc for the [Getting Started Tab](src/Tabs/GettingStartedTab/README.md).

Once you've built the shell and the tabs, you can uplkoad them to blog or yourwebsite, use the loader script shown above to start using SiteInspector.

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
