# Asset Link Guide

## Adding Image Links

Use this guide when adding or referencing image links in documentation or markdown files.

- If the image is `not` from Google Drive, you can place the **direct image URL** as usual.
- If the image is from Google Drive, you must modify the default Google Drive sharing link to make it publicly viewable.

Example:

```md
https://drive.google.com/file/d/(FILE_ID)
```

Change it to:

```md
https://drive.google.com/uc?export=view&id=(FILE_ID)
```