# Himadri Storyteller

https://github.com/himadricreation2018-gif/himadri-creation
download this code and 
Add a complete Blog Management System + Secure Admin Dashboard to the existing Himadri Creation website.

Himadri Creation is a professional photography and event services brand, so the blog system should be designed around photography, weddings, pre-wedding shoots, events, photography tips, client stories and related content.

CORE OBJECTIVE

I want the website owner to manage the entire blog from:

/admin

without editing code manually.

The admin should be able to:

Login securely

Create blogs

Upload blog cover photos

Add multiple images to articles

Edit blogs

Save drafts

Publish blogs

Unpublish blogs

Delete blogs

Manage categories

Add SEO information

Preview blogs

View all published/draft blogs

IMPORTANT

Do NOT introduce a traditional database such as:

MongoDB

MySQL

PostgreSQL

Firebase

Supabase

Use GitHub as the content storage layer.

The publishing architecture should be:

Himadri Creation Admin Panel
          ↓
Secure Serverless API
          ↓
GitHub API
          ↓
Himadri Creation GitHub Repository
          ↓
Vercel / Netlify Automatic Deployment
          ↓
Live Himadri Creation Website


1. ADMIN PANEL

Create:

/admin

The dashboard must match the existing Himadri Creation website branding and should feel like a professional photography-business CMS.

Create navigation:

HIMADRI CREATION
ADMIN PANEL

Dashboard
Blogs
Create Blog
Media
Categories
Settings
Logout


Dashboard should show:

Total Blogs
Published
Drafts
Latest Posts


Keep the interface simple enough that a non-technical website owner can manage it.

2. SECURE ADMIN LOGIN

Create:

/admin/login

Use secure admin authentication.

Use environment variables:

ADMIN_USERNAME=
ADMIN_PASSWORD=
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BRANCH=main


CRITICAL SECURITY RULE

Never expose:

GITHUB_TOKEN
ADMIN_PASSWORD


to the browser.

Never put them inside:

React components

frontend JavaScript

HTML

localStorage

public files

GitHub repository

GitHub API communication must happen through a serverless API/server-side function.

3. CREATE BLOG

Create:

/admin/blog/new

Build a professional blog editor.

Fields

Blog Title

Example:

How to Choose the Perfect Wedding Photographer

Slug

Automatically generate:

how-to-choose-the-perfect-wedding-photographer

Allow the admin to manually edit it.

Category

Provide:

Wedding Photography

Pre-Wedding

Event Photography

Photography Tips

Wedding Ideas

Client Stories

Behind the Scenes

Himadri Creation Updates

Other

Short Description

Used on blog cards and previews.

Cover Image

Allow admin to upload a high-quality image.

Show an image preview before publishing.

Blog Content

Provide a rich text editor supporting:

H1/H2/H3

Bold

Italic

Paragraph

Bullet list

Numbered list

Quote

Links

Image insertion

Image captions

Alignment

4. PHOTOGRAPHY-SPECIFIC IMAGE SUPPORT

Because Himadri Creation is a photography brand, make the image system better than a normal blog CMS.

Allow:

Cover image

Multiple article images

Image captions

Image alt text

Image ordering

Image replacement

Image deletion

Example article:

Wedding Photography Guide

[Cover Photo]

Introduction...

[Wedding Photo]
Caption: Bride and groom during their wedding ceremony

Content...

[Wedding Photo]
Caption: Candid moment with family

Content...


Optimize uploaded images where possible.

Prefer:

WebP / AVIF

Do not unnecessarily upload massive original camera files.

5. SEO SETTINGS

Every blog should support:

SEO Title
Meta Description
Focus Keyword
Canonical URL
Open Graph Title
Open Graph Description
Open Graph Image


Automatically generate reasonable defaults from the blog title and description.

6. GITHUB CONTENT STORAGE

Use GitHub as the content source.

Recommended structure:

/content
    /blogs
        how-to-choose-wedding-photographer.md
        best-pre-wedding-photoshoot-ideas.md

/public
    /blog
        how-to-choose-wedding-photographer.webp
        best-pre-wedding-photoshoot-ideas.webp


For multiple article images:

/public/blog/
    /how-to-choose-wedding-photographer/
        cover.webp
        image-01.webp
        image-02.webp
        image-03.webp


Each blog should contain structured metadata:

title
slug
category
description
coverImage
author
publishedAt
updatedAt
status
metaTitle
metaDescription
keywords
content


7. PUBLISH TO GITHUB

When the admin clicks:

PUBLISH BLOG

perform:

Validate blog
      ↓
Validate images
      ↓
Optimize images
      ↓
Upload/commit images to GitHub
      ↓
Create/update blog content file
      ↓
Commit changes
      ↓
GitHub repository updated
      ↓
Hosting provider detects GitHub change
      ↓
Automatic deployment
      ↓
Blog becomes visible


Show:

Publishing...

Then:

✓ Blog published successfully

If publishing fails:

Unable to publish the blog right now. Please try again.

Do not expose GitHub API errors or secrets.

8. DRAFT SYSTEM

Allow:

SAVE DRAFT

Drafts should be stored in GitHub but should NOT appear publicly.

Use:

status: draft


Published posts:

status: published


Admin should be able to change:

Draft → Published

and:

Published → Draft

9. BLOG MANAGEMENT

Create:

/admin/blogs

Display:

Cover
Title
Category
Status
Published Date
Updated Date
Actions


Actions:

Edit
Preview
Publish
Unpublish
Delete


Before deleting, show:

Are you sure you want to permanently delete this blog?

10. PUBLIC BLOG PAGE

Create/update:

/blog

The page must match the existing Himadri Creation website.

Show premium blog cards with:

Cover image

Category

Title

Short description

Published date

Read More

Example:

[ BEAUTIFUL WEDDING PHOTO ]

WEDDING PHOTOGRAPHY

How to Choose the Perfect Wedding Photographer

Your complete guide to finding a photographer
who can capture your special moments naturally.

READ ARTICLE →


Add pagination or a Load More option if there are many posts.

11. INDIVIDUAL BLOG PAGE

Create:

/blog/[slug]

Example:

/blog/how-to-choose-the-perfect-wedding-photographer

Layout:

Category

How to Choose the Perfect Wedding Photographer

Published on August 12, 2026

[Large Cover Photo]

Article Content

[Photography]

[Photography]

Article Content...

Related Articles

[Blog] [Blog] [Blog]

BOOK YOUR PHOTOGRAPHY SESSION


Make the article highly readable and visually premium.

12. RELATED BLOGS

At the bottom of every article, automatically show 3 related posts.

Match by:

Category

Related keywords

Recent posts

Example:

If the user reads:

Wedding Photography Guide

show:

Wedding Photography Tips

Best Wedding Photo Ideas

How to Prepare for Your Wedding Photoshoot

13. PHOTOGRAPHY BRAND CTA

At the end of every blog article add a strong Himadri Creation CTA:

“LET'S CAPTURE YOUR STORY.”

Supporting text:

“Planning a wedding, pre-wedding shoot or special event? Let Himadri Creation turn your moments into memories you'll love forever.”

CTA buttons:

BOOK A SHOOT

CONTACT US

Connect these buttons to the existing website booking/contact flow.

Do not break the existing booking system.

14. ADMIN MEDIA LIBRARY

Create:

/admin/media

Show uploaded blog images.

Admin should be able to:

View images

Copy image URL/path

Delete unused images

Upload new image

Use a clean photography-focused grid.

15. EXISTING WEBSITE MUST NOT BREAK

Before making changes, inspect the existing Himadri Creation project.

Do NOT unnecessarily replace the existing:

Navbar

Hero

Gallery

Services

Portfolio

About section

Booking system

Contact section

Footer

Existing responsive design

Existing animations

Existing brand identity

Integrate the Blog system into the existing project.

Add:

BLOG

to the website navigation where appropriate.

Reuse existing components and styling whenever possible.

16. SECURITY

Implement:

Secure admin authentication

Protected admin routes

Server-side GitHub API calls

Environment variables

Session protection

Input validation

Image type validation

Image size validation

Slug validation

Unauthorized request protection

Never expose:

GITHUB_TOKEN
ADMIN_PASSWORD


to the client.

17. ENVIRONMENT VARIABLES

Create:

.env.example

with:

ADMIN_USERNAME=
ADMIN_PASSWORD=
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BRANCH=main


Do NOT put real values inside it.

Ensure .env is included in .gitignore.

18. ERROR HANDLING

Handle properly:

Wrong admin credentials

Expired login

Unauthorized admin access

Duplicate slug

Empty title

Empty content

Invalid image

Image too large

GitHub API failure

GitHub commit conflict

Network failure

Failed deployment

Give the admin simple messages.

19. PERFORMANCE

Because this is a photography website, image performance is very important.

Implement:

Responsive images

Lazy loading

Modern image formats

Proper width/height

Optimized thumbnails

SEO-friendly image alt text

Avoid unnecessarily loading full-resolution photography on blog cards

Do not sacrifice image quality unnecessarily.

20. RESPONSIVE DESIGN

The entire blog system must work perfectly on:

Desktop

Laptop

Tablet

Mobile

Admin panel must also be responsive.

Mobile admin should remain easy to use for uploading photos and publishing blogs.

21. FREE-TIER FRIENDLY ARCHITECTURE

Keep the architecture compatible with free-tier hosting.

Do not require a paid database.

Target architecture:

Existing Himadri Creation Frontend
             +
        Admin Panel
             +
     Serverless API
             +
       GitHub Repository
             +
     Vercel / Netlify


The system should work without maintaining a traditional backend server.

22. FINAL USER EXPERIENCE

The website owner should be able to do this:

Open:

himadri-creation.com/admin

        ↓

Login

        ↓

Create New Blog

        ↓

Write Article

        ↓

Upload Wedding / Event Photos

        ↓

Add SEO Information

        ↓

Save Draft OR Publish

        ↓

Click Publish

        ↓

Secure API sends content to GitHub

        ↓

GitHub updates

        ↓

Automatic deployment starts

        ↓

Live Blog appears on:

himadri-creation.com/blog


The final implementation must be production-ready, secure, responsive, photography-focused, easy to maintain and easy for a non-technical owner to operate.

Before writing or replacing code, inspect the existing Himadri Creation codebase and integrate this system into the current architecture rather than rebuilding the entire website.

Do not remove or break any existing functionality.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://capture-content-craft.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b2d5b604-eb9a-4c40-bb40-320518c4aade).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
