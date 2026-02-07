---
title: 'Frontend Framework 101: Things You Should Know Before Learning a Framework'
date: '2021-07-11'
draft: false
summary: Choosing a frontend framework has always been a big question for many beginners (including me). I started writing React because my company was using it. Recently, due to some circumstances, I started touching Angular, which inspired me to think more about "Frontend Frameworks". Issues like what "framework" actually refers to? What can be called a "framework"? Why does frontend need to use it? What happens if you don't use it? I heard Vue3 is powerful, should I learn it? And so on.
tags: ['Software Development', 'Web Development', 'Frontend', 'Framework', 'JavaScript']
---

> **Note:** This post is translated by AI. If you find any unnatural phrasing or errors, please feel free to contact me via email or other channels. Your feedback is appreciated!

Choosing a frontend framework has always been a big question for many beginners (including me). I started writing React because my company was using it. Recently, due to some circumstances, I started touching Angular, which inspired me to think more about "Frontend Frameworks". Issues like what "framework" actually refers to? What can be called a "framework"? Why does frontend need to use it? What happens if you don't use it? I heard Vue3 is powerful, should I learn it? And so on.

This article can be considered as my thinking in solving some of the above problems, and it is also some basic concepts I think we should know before jumping into learning a framework.

## Briefly Talk About Web History

Technology develops rapidly, but the essence of technology is actually "solving problems".

> By understanding the context of technology, I believe it is very helpful for understanding current technology and imagining future development.

---

**1990s: Birth of the Web**

- On December 20, 1990, Tim Berners Lee wrote the [first website](http://info.cern.ch/hypertext/WWW/TheProject.html) and designed the World Wide Web.
- This period was dominated by static web pages, at most with some dynamic menus and image effects.

**2000s: Web 2.0 + Ajax**

- The birth of Web 2.0 in 2004 increased the interactivity of web pages. Facebook (2004) and Youtube (2005) came out during this period.
- The application of Ajax asynchronous requests allowed web pages to send requests via JS instead of the browser, thus not needing to reload to update data.

**2010s: Concept of Web Application Emerges**

- From this time on, the complexity and interactivity of the Web have significantly improved, gradually being able to do things that only Desktop Applications could do originally.

> To cope with some basic processing required by such highly interactive websites, frontend frameworks were born.

1.  Angular 1.0 (2010)
2.  React (2013)
3.  Vue (2014)

(If you are interested in a more detailed evolution history, reference links will be attached at the bottom)

## Specifically, what do frontend frameworks handle for us?

### 1. Components

> Reusable, independent UI, such as Button

- Using pure native HTML, CSS, JS to achieve the concept of Component is very troublesome. With frameworks, we can quickly write Components, helping us reuse code, accelerate development, and improve developer experience.
- A Component will include **Methods for cross-layer communication (External Props)**, **Manageable internal states (Internal States)**, and **User events (Listen to browser events)**.

### 2. State Management

> _Manage the interaction flow between Data and User operation events_

- The state in a web page represents the stage you are in on the current website. For example, a membership system will have visitor and member states, and messages will have read and unread states, etc. Depending on the complexity of the website, you will also have many states to manage in the entire web application.

Roughly there are three situations:

1.  **Component-Level State**: State is managed and used only within a single component, like `useState` in React.
2.  **Share State Across Components**: Data or state is passed between components, and situations where it affects multiple components simultaneously, like `useContext` or Props in React.
3.  **Global State**: State that can be managed and accessed anywhere in the web page. In React, it is usually managed with Redux.

### 3. Life Cycle

> The process of the framework operating on the browser, helping us handle DOM and browser rendering mechanism

_When the Components we write actually appear on the browser, they actually go through this process: Mounting → Updating → Unmounting_

- Mounting: When the component's instance is created and displayed on the DOM.
- Updating: When the state changes, re-render the DOM.
- Unmounting: When the component is about to be removed from the DOM.

Each framework follows such a process, but the way to trigger re-render will vary depending on the underlying implementation logic, which relates to how the framework responds to user interaction events and state changes. Performance optimization for frameworks is largely about handling the re-render mechanism.

### 4. Routing (Client-Side)

> _Handle navigation and switching between pages on the frontend_

_Past practice where Server directly spits out HTML to frontend_

- When you click a link on the website, the browser communicates with the server and gets new content to display to you.
- After getting the new content, the URL in the address bar will change.

Practice of Frontend Frameworks

- Server only returns an HTML as the root node, subsequent changes are correcting its DOM.
- Because switching between pages is no longer done through the browser, but dynamically changed by JS on the frontend, routing also has to be implemented by the frontend.
- React needs React-Router to assist implementation, while Angular has its own built-in Routing system.

## Benefits brought by Frontend Frameworks

After talking so much about concepts applied by frameworks, let's sort out the benefits and effects these concepts can achieve.

### 1. Better Developer Experience

> Frontend frameworks, like many technological changes, did not provide new functions to JavaScript itself, but only provided a way for us to write websites more easily.

1.  Writing reusable independent components greatly increases code readability and maintainability. The method of trying to repeatedly create new DOM elements with native JS in the past is hard to understand at a glance. You can try to compare the code of a To-Do List before and after using a framework to know the difference.
2.  Using the framework itself can improve the work efficiency of the team and individuals. With the knowledge architecture of the framework, many specifications will be defined at the framework level, thus greatly reducing the cognitive burden of understanding the project.

### 2. Various useful tools and ecosystem

After a technology rises, people will continue to develop many useful tools on this basis, and there will be many new possibilities and problems not thought of before. After the trend is brought up, people who like to use this technology will gradually form a "community".

The community will build an ecosystem for this technology. Developers will develop various tools according to needs to improve future development experience and efficiency.

Therefore, the technology itself is important, but it is also very important to make people willing to use the technology.

(Technology also needs to know marketing. Only with successful marketing and a community can it be carried forward. After all, the ability of an individual or a small group is really limited.)

## Talked so much, how to choose a framework?

> Only children make choices, adults solve problems.

After understanding the above concepts, we can know that major frameworks are solving similar problems and have common implementation concepts. Only the underlying mechanisms are slightly different. Learning other frameworks is just getting familiar with new syntax and implementation mechanisms. Behind them actually shares the same set of thinking circuits for solving problems.

Therefore, compared to choosing, we should care more about:

1.  Be more familiar with JavaScript.
2.  Understand how the concepts mentioned above operate and are implemented in the framework.

If you really want to choose a framework, it is suggested to read through the documents of React, Vue, and Angular, write a Tutorial, and feel which framework you prefer.

> Actually, no framework can let you write for a lifetime.

In the process of learning frameworks, always remind yourself not to become a "framework engineer", meaning not just being very familiar with using the "tool" of framework, but ignoring what problems the framework appeared to solve in the beginning, and what problems of the current framework subsequent technological changes are to solve.

For example, the concept of Server-Side Rendering has been very popular recently, and there will definitely be many changes in the future.

## Finally, clarify concepts: Framework vs Library

Although we are used to saying "Three Big Frameworks", React can actually only be said to be a Library, because as a framework, it handles too few things for you.

Framework: As mentioned above, it would be a fully functional bucket, and has stricter requirements for implementation methods, such as Router, FetchAPI operations will have regulations.

Angular perfectly meets the standard of a framework because it integrates everything into official APIs.

Library: Taking React as an example, it actually only handles Life Cycle. Others need third-party Libraries to help integrate, like `react-dom` for renderer, `react-router` for router, etc.

## Conclusion

Actually, there are still many things not covered, but as said at the beginning, the purpose of this article is just to let everyone grasp some architecture before learning frameworks, understand where this technology comes from, why it should be used, what problems it solves, instead of jumping blindly to learn. Like when I first jumped directly into the ocean of Angular documentation, I really felt like I was drowning. But if you can grasp the basic architecture of the framework first, I believe you won't be as helpless as in the vast ocean, at least you can see an island in the distance 🏝.

Finally, thank you everyone for reading this far. This is my first time writing a technical article. Actually, I wanted to start writing for a long time. After all, I usually benefit from many seniors who are willing to share. Thanks to the encouragement of [Kyle Mo](https://medium.com/u/fac5c5351760) and [Ian-Lai](https://medium.com/u/8dc1b4a51ee9), I finally took the first step!

If there is anything unclear, please leave a message to tell me. Hope the content shared this time is helpful to everyone. See you next time~

---

If you like it, welcome to clap for me. You can clap up to 50 times. Just clap according to how helpful you think it is. This can also be a basis for me to adjust 🙌

## References

Evolution history related links:

- [https://developer.mozilla.org/zh-TW/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Introduction](https://developer.mozilla.org/zh-TW/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Introduction)
- [https://kuro.tw/posts/2019/07/31/Thinking-about-frontend-frameworks/](https://kuro.tw/posts/2019/07/31/%E8%AB%87%E8%AB%87%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6/)
- [Web Technology History](https://jaceju.net/webdev-history/)
- [The History of Web](https://webflow.com/ix2?rfsn=4725891.148689&utm_medium=affiliate)
