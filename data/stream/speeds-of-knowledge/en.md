---
title: Knowledge Moves at Different Speeds
date: '2026-10-21'
draft: false
review-by-me: false
---

I borrowed this title from a [📹 talk](https://youtu.be/81WR7hJOWUk) by Kuo-Wei Cheng, the founder of [🇹🇼 PanSci](https://pansci.asia/), in which he shares his journey in science communication.

What follows is my summary of this part of the talk, not a word-for-word quotation:

When choosing topics, his team considers not only the practical question of whether a subject will attract attention, but also what speed of knowledge it belongs to.

> Fast knowledge is things like news. If you don't cover it today, other stories will bury it tomorrow.\
> Medium-speed knowledge is things like technology trends. They change quickly, but have a long history behind them. There may be news every day, but if you only chase the headlines, you'll see the waves and miss the currents beneath them. AI, semiconductors, space, energy, and biomedicine all fall into this category.\
> Slow knowledge doesn't rush to capture today's traffic or keep up with tomorrow's conversation. It takes time to unpack a question and look at its history, methods, controversies, and human nature.

> For fast knowledge, PanSci makes three-minute science news videos. For medium-speed knowledge, it makes videos of 10–15 minutes, aiming to give newcomers a simple map of the subject. For slow knowledge, it makes long videos in its Slow Science series. This kind of knowledge is too hard to compress: you need to understand how scientists ask questions, how they collect samples, what mistakes they have made, and how they correct them. Even then, there may be no clear answer, only an understanding we can provisionally trust.

> He also shared his approach to scientific literacy: “When things move fast, be able to judge; when things move slowly, be able to stay with them.” We're used to speeding everything up now: watching at double speed, reading quick summaries, mastering whatever subject in no time. But some things can't be mastered that quickly. When you think you've mastered something too fast, what you've usually acquired is a very complete misunderstanding.

In the age of AI, perhaps knowing how quickly or slowly to approach different kinds of knowledge is an essential skill.

Listening to Kuo-Wei talk about slow knowledge really drove home for me that understanding a large software project is a form of slow knowledge. Contributing to Apache Kafka as an open-source project has been all about dealing with its history, methods, controversies, and human nature. The project is already 15 years old, and many systems that process real-time data still use it. In a system with that much history and that many users, there are often many ways to implement the same feature. Once you actually start working on it, your approach may conflict with what users or other developers have in mind. In an open-source project, the business interests of the companies doing most of the maintenance also influence technical tradeoffs.

When I work with AI on Kafka, it often gets misled by all the traces of the project's history. For example, while editing the documentation, we had previously left a redirect file in place. It existed to support an old URL that was still being used in some places, but nothing in the project itself made that clear. The AI had no idea what to do with the file and could only spout bullshit with a straight face.

Although the way we develop software has changed dramatically, the job itself still comes down to understanding history, clarifying requirements, and working things out with people who have different perspectives.

When it comes down to it, perhaps nothing we do can escape dealing with history, methods, controversies, and human nature.

I've only summarized a small part of the talk. All 24 minutes are excellent, and it also touches on these interesting topics:

1. A defeat on one front repackaged as a philosophical position
2. Heavy on emotion, thin on evidence
3. The scientific temperament: waiting a little longer before deciding
4. Science communication means finding a way in for the audience; designing that communication doesn't mean pandering
5. Metaphors are scaffolding: take them down once you understand
6. The tradeoff between attention and accuracy
7. Scientific literacy in the age of AI: getting better at asking for sources and telling “well organized” apart from “correct”

I highly recommend watching it.
