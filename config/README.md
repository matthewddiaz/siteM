NOTE SiteM was originally supposed to be a simple blog thus named blog-dev in
Bluemix. However this blog soon after got converted to my new website matthewddiaz.com

This NoSQL cloudant database for the blog was called blog-db. That same
database was used for siteM my new website.

To connect to blog-db I am using 'nano js' minimalistic couchdb driver for node.js;
by dscape on github.

NOTE 2: The doc_id for insertions with documents that have attachments is the
        property projectName. To make this process more secure and harder for
        non authorized to access the projectName is encrypted using 'crypto' module.
