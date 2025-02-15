# 🎉 Welcome to the matter.party 🥳

This is the source for [https://matter.party](https://matter.party), which is a community-built directory of matter devices of all kinds.

---

## Contributing Devices

All of our device entries live in the `/devices/` directory. In there, they're sorted by device type in to folders, but this is only for our convenience -- when the site is built, all of the files are pulled regardless of where they are in the directory tree.

Device entries are written in markdown, and use the YAML-flavored frontmatter syntax to store metadata about the device. All fields are optional, but the more information you can provide, the better. Any notes added in the body of the file will show up on the device's detail page, but won't be searchable.

Templates for each device type are available in the `/reference/templates` directory. To add a new device, simply copy the right template over to somewhere sensible in the `/devices` directory, and fill in the required fields.

Submit a PR with your new device, and we'll review it as soon as possible.

### Variants

Many devices will come in multiple variants, such as different sizes, numbers in the package, colors, etc. matterparty assumes that variants are mostly the same thing but a different shape/size/color/etc for the sake of simplicity. If the variants are vastly different (???) then add multiple entries.

Otherwise, note that the `product_info` frontmatter contains a `variants` array, which contains an object for each variant. The [template](/reference/templates/smart_bulb.md) has two entries so you can see how it works.

### Links

Where possible, provide a link to the canonical product page from the manufacturer. This should be in the `product_info[foo][official_product_page_url]` value. *Do not include affiliate links. Period.*

---

## Site Structure

Matter.party is simple -- there are only two pages.

### The Device Index

The device index is a huge list of all of the devices in the database. It's formatted like a giant spreadsheet because it is one. 

At the top of the table, each column has a header that if clicked will sort the column in ascending or descending order. The filter icon on each column lets you filter that column. If a filter is applied, an X will appear to the right of the filter icon, which allows you to quickly clear the filter.

Above the table is a search bar that searches across all data contained in each device's frontmatter entry. This _does not search_ the community notes, but you can use it to quickly find a device by the model name, number, sku, or even something weird like lumens or price.

> Note: At some point this table will probably need to be broken in to multiple pages or something, but it's simpler to wait until the size becomes really problematic.

### Device Details

When you click on a device, you can visit the device's detail page. This is a linkable page that contains all of the data we have on that device. At the top of the page there is a nicely formatted high-level overview of the device and below that is a caret that lets you expand the information to see the raw data that's contained in the frontmatter.

Below that header we display whatever community notes that were added in the body of the markdown file.

Each page also contains a link directly back to its source in Github to make contributions simpler -- if someone finds a problem, it's trivial for them to submit a correction.

---


## FAQ

1. Why is this all in markdown and yaml? Those are miserable database languages.
   - Indeed they are! But markdown and yaml are _exceptionally_ simple to read and write for humans, and we're not assuming that all smart home enthusiasts are also software engineers. Using an _actual_ database would also require additional security and authentication, which we're offloading to Github by making people submit PRs.

2. I found a mistake! Something is wrong on the internet!
   - Great! Unlike the rest of the internet, this part is editable. Submit a PR with your correction and we'll happily take your changes.

3. Does this site make money off of affiliate links or anything like that?
   - No! The contribution guidelines ☝️ politely ask that you do not include them, and if it becomes a problem, we'll make removing them part of the build process.
