---
title: 'The Journey of My Site: Why write and Technology Choices'
date: '2023-05-30'
tags: ['self-discovery']
draft: false
summary: About "Why set up a personal website", "why write" and "how to choose the tech stack"
---

## Why Set Up a Personal Website?

As front-end engineers, most of us might thought about (or dreamed of) setting up our own websites. However, we may be held back by the curse of knowledge and the burden of perfectionism.

With our professional knowledge, we are aware of the intricacies of creating websites, and after understanding what it takes to make a website truly excellent, we tend to overthink or desire too much customization, which delays our actions.

Moreover, after writing on Medium for a while, I really couldn't stand it anymore. Medium is not very friendly towards the Chinese community, it doesn't have good SEO, and its article formatting is difficult to adjust. All these factors have deterred me from writing more articles.

Finally, taking advantage of my birthday, I decided to give myself a birthday gift and enthusiastically spent two days setting up my personal website.

During the construction process, looking at the semi-finished products I've built, I truly felt that I've grown. The construction this time was more proficient and quicker, and the end product was more satisfying.

Since 2019, my annual goal has been to set up a personal website, and I have finally achieved it!

> Now that I've discussed my motivation for setting up a website, the next big question is: why write?

---

## Why write?

**1. To Satisfy Myself**

I'm also notorious for posting long texts on FB, IG. I think I have a deep-seated desire to write, I just haven't found the right writing space.

**2. Writing is Not the Product of Thinking, but Your Actual Thought Process**

Those who write should have similar experiences: the more you write, the more you want to write. Through writing, we can have a dialogue with ourselves, organize our thoughts. I also use writing to clarify many requirements and processes. And usually, if you can write it out, it means you understand it.

**3. Writing Can Transcends Time and Space**

The book I'm reading now, "The Modern Times," is a work by Kotaro Isaka written in 2008. The article by Huli that I shared a while ago was shared in 2020. And here I am, in 2023, being influenced by their words.

I'm starting to anticipate the impact my words might have as time goes by. Of course, they might have no impact at all, but that's okay too.

**4. To Spark Discussion**

Writing down what you think and learn can clarify your thoughts, and occasionally, some passers-by may provide ideas and engage in discussions. The experience of discussing with others is undoubtedly precious and useful.

(However, I'd respectfully decline anyone who merely wants to criticize without constructive feedback.)

**5. Practice English and Japanese**

In addition to the benefits of writing mentioned above, practicing other languages is also helpful. I believe the fastest and most enlightening way to learn anything is through doing it. Start writing articles in the target language, and you can quickly accumulate understanding of vocabulary and grammar. It won't be easy at the beginning, but I believe it will be rewarding as you progress.

> After discussed the "why," let's move on to the "how" (the technical choices)!

---

## Technical Choices

> As I'm a web engineer myself, I wouldn't consider Wordpress or other template websites. The time spent exploring these tools could be longer than writing by myself, and there's less sense of accomplishment and too many issues, haha.

I've sequentially tried

1. [Next.js](https://nextjs.org/)
2. [Hexo](https://hexo.io/)
3. [Astro](https://astro.new/latest/)
4. [Docusaurus](https://docusaurus.io/)

After a grand tour, I've returned to Next.js. The main reasons for choosing it are:

1. I know how to write it, so there's no need to learn another tool.
2. Next.js can be used in my job, and it's being adopted by more and more companies.
3. Compared to other tools, I think Next.js is the most flexible and customizable. Whether you want to keep it very simple or make it flashy, you can do it. (Although I may not do that, I like having the option.)

Actually, my goal is quite simple: support multiple languages, Markdown format, table of contents, tags, dark mode, search functionality, comment section... etc. (It's not simple at all!)

If I were to write all these features myself, it would be really exhausting. But I also don't want to deal with the pitfalls of new tools (many Hexo Themes are not maintained anymore, Astro requires understanding a bunch of new syntax). I suddenly realized that even if I use Next.js, it doesn't mean I have to write everything by hand. There must be many people who have already created blog templates.

By using the keywords **"nextjs blog template"**, I found [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog), and its [i18n version](https://github.com/GautierArcin/i18n-tailwind-nextjs-starter-blog). Finally, I used this version as the base and made modifications to create what you see now!

As for the domain, I buy it from GoDaddy. The suffix `life` is because of the content of the site would be anything I think, encounter.

Deployment is to use Vercel first, and then wait for the traffic to increase to see if I have to change it.

---

## Current Planning and Expectations for the Website

The first thing, of course, is to move and translate the articles I've written before. I plan to post one per week! Practicing writing an English and Japanese article each week sounds about right (but reality is tough, we'll see how much I can actually do).

Content-wise, I expect it to cover web technology articles, reading notes, personal reflections, and some valuable shares!

As for functionalities, I will gradually develop features like "comments," "side table of contents," "support me," "newsletter," etc., and occasionally update the styles (to see if I can include some flashy animations).

In addition, I personally love watching anime and write novels in my spare time. However, it feels a bit chaotic to put them all here, so I might move them to another website in the future (or I might just dump everything here if I get lazy).

Thank you for reading up to this point, and stay tuned!
