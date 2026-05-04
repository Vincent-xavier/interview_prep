import { Question } from '../../types';

const questions: Question[] = [
{ id:"hr1", level:"beginner", q:'Tell me about yourself. (Self Introduction — 2 min version)', a:`Tailor this to match your actual experience. Sample for your profile:

"My name is Vincent Xavier. I'm a Full Stack Developer with 3+ years of experience specializing in .NET Core and React.

I currently work at Bosco Soft Technologies where I've built enterprise and healthcare applications for multiple clients — supporting over 500 end users in production. Some highlights:

→ I architected key modules of BBH, a large hospital management system — including an inventory module that reduced manual procurement processing time by 30%, and a mobile app with Razorpay integration that processes payments for 200+ daily users with 99.9% success rate.

→ I've built secure RESTful APIs with JWT and role-based access, optimized database performance by 40% through query tuning, and shipped features end-to-end from API design to React frontends.

→ On the process side, I work in Agile/Scrum sprints, do regular code reviews, and maintain a defect escape rate below 5%.

I'm now looking for a role where I can take on more architectural ownership, work on larger-scale distributed systems, and grow as a technical leader.

That's a quick overview — I'm happy to dive into any specific area you'd like to know more about."

Tips:
- Keep it under 2 minutes.
- Structure: Who you are → Current role + key achievements → What you're looking for.
- Tie your experience directly to the job description keywords.` },
  { id:"hr2", level:"beginner", q:'Why do you want to leave your current company?', a:`Dos — frame it positively around GROWTH, not escape:
- "I've had a great run at Bosco Soft — worked on healthcare and enterprise apps, built real production systems. But I feel I've reached a growth ceiling there and I'm ready for a bigger challenge."
- "I want to work on a larger scale — more users, more complex architecture decisions, exposure to distributed systems."
- "I'm looking for a role with clear senior/lead growth path."
- "I want to work in a product company / specific domain (fintech, healthcare) where I can go deeper."

Don'ts (never say these):
- "My manager is difficult / toxic culture."
- "I want more salary" (even if true, don't lead with it).
- "I'm bored." (instead: "I'm looking for more challenge.")
- Anything negative about current employer.

Tip: Research the target company and tie your "what I'm looking for" to what THEY offer.` },
  { id:"hr3", level:"beginner", q:'What is your greatest strength?', a:`Pick a strength relevant to the role. For a full-stack .NET/React developer:

Example answer:
"My biggest strength is my ability to own features end-to-end — from database design through API to the React frontend — and taking accountability for production quality. At my current role, I've consistently maintained a defect escape rate below 5%, which I'm proud of. I don't just write code and move on — I think about edge cases, error handling, and performance from the start."

Other good options for your profile:
- Problem-solving: "I'm very strong at diagnosing production issues — I've tracked down slow queries, race conditions, and memory leaks systematically."
- Learning speed: "I pick up new technologies fast. I taught myself React Native and shipped the BBH mobile app with Razorpay integration in production."
- API design: "I have a solid instinct for clean, consistent REST API design with proper versioning, error handling, and security."

Formula: State the strength → Give a specific example → Quantify the impact.` },
  { id:"hr4", level:"beginner", q:'What is your greatest weakness?', a:`Pick a REAL weakness that you're actively working on — not a fake strength disguised as weakness ("I work too hard").

Good examples for a developer:

Option 1 (Communication):
"I sometimes go deep into solving a technical problem independently before looping in teammates or escalating — which can delay surfacing blockers. I've been actively working on this by setting a personal rule: if I'm stuck for more than 2 hours, I document my attempts and ask for a second opinion. It's made my work faster and improved team collaboration."

Option 2 (Frontend polish):
"I'm stronger on the backend and API side than on pixel-perfect UI design. I compensate by working closely with designers and leaning on component libraries like MUI and Tailwind, but I actively study design systems to improve."

Option 3 (Public speaking / presentations):
"I'm not the most comfortable with presenting to large groups. I've been improving by volunteering to do sprint demos and internal knowledge sharing sessions."

Formula: Real weakness → Acknowledge impact → Show what you're doing to improve.` },
  { id:"hr5", level:"intermediate", q:'Tell me about a time you faced a significant technical challenge. How did you handle it?', a:`Use the STAR framework: Situation → Task → Action → Result

Example (tailored to your resume):

Situation: "In the BBH hospital management system, we had a critical issue where the inventory stock levels were showing incorrect values during peak procurement hours — sometimes double-counting stock deductions."

Task: "I was responsible for the inventory module, so I needed to identify the root cause and fix it without impacting the hospital's live operations."

Action:
"I started by reproducing the issue in staging under concurrent load. Using query analysis, I found that multiple concurrent API calls were reading and updating stock without proper isolation — a classic race condition. I added row-level locking (SELECT FOR UPDATE in PostgreSQL) around the stock deduction logic, wrapped it in a transaction, and added a unique constraint to prevent duplicate deduction records. I also wrote tests that simulated concurrent requests to validate the fix."

Result: "After the fix, double-booking incidents dropped to zero — a 100% reduction. The fix was deployed during a low-traffic window with zero downtime. The client reported no further inventory discrepancies."

Tips: Be specific, quantify results, show your debugging methodology.` },
  { id:"hr6", level:"intermediate", q:'Tell me about a time you disagreed with a technical decision made by your team or manager.', a:`STAR example:

Situation: "During a code review in one of our projects, a senior colleague proposed implementing a feature using raw ADO.NET directly instead of Entity Framework Core, arguing it was faster."

Task: "I had a different view — I felt the performance difference wouldn't be significant for our use case, and raw SQL would increase maintenance burden significantly."

Action: "Rather than dismissing the idea, I prepared a quick benchmark comparing both approaches for our specific query patterns. The data showed EF Core with proper indexing was only ~5ms slower but saved significant development and maintenance time. I presented this to the team calmly, acknowledged the valid performance concern, and proposed EF Core with raw SQL only for the identified hot paths."

Result: "The team agreed with the data-backed approach. We used EF Core for most queries and raw SQL for two specific reporting queries. The codebase stayed clean and maintainable."

Key lessons to convey:
- You present data, not opinions.
- You respect the final decision even if overruled.
- You don't make it personal.` },
  { id:"hr7", level:"intermediate", q:'Describe a situation where you had to work under pressure or meet a tight deadline.', a:`STAR example:

Situation: "During the BBH project, a hospital client needed the Supplier Registration Portal live before the new financial year — about 3 weeks earlier than our original timeline."

Task: "I was the lead developer for that module. The requirement meant compressing a 6-week sprint into 3 weeks without compromising quality."

Action:
"I quickly re-scoped with the PM — identified which features were MVP vs nice-to-have. We deferred 2 non-critical reporting views to the next sprint. I structured the remaining work into daily deliverables, communicated progress daily, and flagged blockers immediately. I also paired with a junior developer to parallelize frontend and backend work."

Result: "We delivered the portal on time. Within the first quarter, 50+ suppliers were onboarded. The deferred features were shipped in the next sprint as promised. The client was happy and it strengthened our relationship."

Show: Prioritization, communication, calm under pressure, delivering results.` },
  { id:"hr8", level:"intermediate", q:'How do you handle receiving critical feedback on your code or work?', a:`Honest answer structure:

"I actively welcome code review feedback — it's one of the fastest ways to grow. When I receive critical feedback, my first instinct is to understand it fully before reacting. I ask clarifying questions if needed: 'What problem are you seeing with this approach?' or 'Can you point me to a better pattern?'

If the feedback is valid (which it usually is), I fix it, add a note in the PR explaining what I changed and why — so the reviewer knows I understood the point, not just the fix. I also make a mental note to avoid the same pattern in future code.

If I genuinely disagree, I'll raise it professionally with reasoning and data rather than dismissing it — same as I'd want others to do with my feedback.

I've found that teams with strong code review culture produce much better software. I try to give feedback in the same way I'd want to receive it — specific, kind, focused on the code not the person."

This shows: Maturity, learning mindset, communication skills, no ego.` },
  { id:"hr9", level:"intermediate", q:'Where do you see yourself in 3-5 years?', a:`Frame it around growth in your technical domain, aligned with the company you're interviewing with.

Example:
"In 3-5 years, I see myself growing into a Senior Developer or Tech Lead role — someone who not only builds features but also shapes architectural decisions, mentors junior developers, and bridges the gap between business requirements and technical implementation.

Specifically, I want to deepen my expertise in distributed systems and cloud-native development — areas like event-driven architecture, microservices at scale, and performance engineering.

I'm also interested in the people side — doing more mentoring and driving technical standards within a team.

I'm looking for a company where I can grow into that role gradually, take on increasing responsibility, and contribute to something meaningful."

Tips:
- Research the company's career ladder before the interview.
- Show ambition but also groundedness.
- Connect your goals to what the company can provide.
- Don't say "I want your job" or "I want to start my own company."` },
  { id:"hr10", level:"intermediate", q:'How do you stay up to date with new technologies in the .NET and React ecosystem?', a:`Be specific — don't just say "I read blogs."

"I stay current through a mix of structured and passive learning:

Daily/Weekly habits:
- I follow the official .NET Blog, React blog, and TypeScript release notes for major updates.
- I'm subscribed to a few newsletters: ByteByteGo for system design, C# Digest, React Newsletter.
- Twitter/X: I follow the .NET, React core teams and community contributors.

Project-based learning:
- When I learn something new, I build a small proof-of-concept with it rather than just reading. For example, I explored Minimal APIs by rebuilding a small service, and learned RTK Query by replacing a custom useEffect+fetch pattern.

Community:
- I occasionally read through GitHub issues and discussions for libraries I use — it gives insight into how things work under the hood.

At work:
- I bring new patterns into code reviews and team discussions. I recently introduced output caching in our .NET API after reading about it in .NET 7 release notes.

I find that teaching or explaining something (even just writing notes) is the best way to solidify understanding."` },
  { id:"hr11", level:"intermediate", q:'Describe your experience working in Agile/Scrum teams.', a:`"I've worked in Agile/Scrum for the past 3 years at Bosco Soft Technologies. Our standard setup is 2-week sprints with:

Daily standups: Quick 15-minute syncs — what I did, what I'm doing, any blockers. I make sure to surface blockers early rather than sitting on them.

Sprint planning: I actively participate in estimating stories using story points. I've learned to ask clarifying questions during grooming to catch hidden complexity early.

Code reviews: We review every PR before merge. I both give and receive reviews — it's where a lot of learning happens.

Retrospectives: I genuinely engage with retros — I've raised specific process improvements like adding a staging environment validation step before production deploys, which reduced hotfixes.

Metrics I've maintained:
- Defect escape rate below 5% across all production releases.
- Consistently deliver sprint commitments — I break tasks down early to detect risks before mid-sprint.

In terms of tools, I've used Azure DevOps for board management, work items, and CI/CD pipelines."` },
  { id:"hr12", level:"intermediate", q:'Tell me about a time you mentored or helped a junior developer.', a:`STAR example:

Situation: "A junior developer on our team was struggling with understanding how Entity Framework Core queries translate to SQL — they were accidentally loading entire tables into memory and doing filtering in-memory, causing performance issues."

Task: "I noticed this during a code review and wanted to help them understand the pattern, not just fix the code for them."

Action: "I scheduled a 30-minute pair programming session. I showed them how to use SSMS/PgAdmin to see the actual SQL being generated, demonstrated the difference between IQueryable (deferred, DB-side) and IEnumerable (in-memory) with real examples from our codebase. I also set up a rule in our code review checklist: 'Check if LINQ queries hit DB or materialize early.' I followed up in the next two PRs to reinforce the lesson."

Result: "They started catching their own query patterns in subsequent PRs — even flagging similar issues in other developers' code. The follow-up PR had correct IQueryable usage with proper filtering pushed to the DB."

Show: Patience, teaching style, follow-through, impact.` },
  { id:"hr13", level:"advanced", q:'What is your approach to estimating tasks in a sprint?', a:`"I approach estimation with a mix of breaking things down and accounting for unknowns.

My process:
1. Decompose the task: Break any story larger than 1-2 days into subtasks. If I can't decompose it, it's a sign I don't understand it well enough — I ask questions first.

2. Consider the full cycle: I estimate for the complete task — not just coding. This includes understanding requirements, development, unit tests, code review, staging validation, and any documentation.

3. Account for unknowns (spike tasks): If there's significant ambiguity (new library, unclear requirement), I propose a time-boxed spike (e.g., half a day to investigate) before committing to an estimate.

4. Calibrate against history: I keep a rough mental model of how long similar tasks have taken me in this codebase — CRUD API endpoints typically take X hours; complex business logic Y.

5. Communicate assumptions: When estimating, I state assumptions ('This assumes the DB schema is finalized'). If an assumption breaks, the estimate is renegotiated.

What I avoid: Never pad estimates silently — if I'm uncertain, I say so. 'I'm estimating 3 points but there's a risk it could be 5 if the third-party API has issues.'

I've found transparent estimation builds more trust than always hitting numbers by padding." ` },
  { id:"hr14", level:"advanced", q:'How do you handle multiple priorities or tasks at the same time?', a:`"I use a combination of prioritization and communication rather than trying to context-switch rapidly.

My approach:

1. Clarify priority with the PM/team: I never silently decide priority myself. If two things land at once, I ask 'Which is higher priority — X or Y?' This protects me and sets expectations.

2. Timebox and switch cleanly: If I must work on multiple items, I block time — e.g., morning for feature work, afternoon for bug fixes — rather than switching every 30 minutes. Context switching is expensive for complex engineering work.

3. Communicate progress and blockers proactively: If a priority shift means something else is delayed, I flag it early — not at the deadline. 'If I work on the urgent bug today, the inventory feature will slip by 1 day — is that okay?'

4. Use the work item system: I keep Azure DevOps/JIRA updated with current status. It means my team always knows where things stand without asking me.

An example: In one sprint, a production bug was raised mid-sprint for our live hospital system. I communicated to the PM, scoped the bug fix (2 hours), made an explicit commitment on which sprint items would be deprioritized if needed, fixed the bug, then returned to sprint work — all with the team's alignment."` },
  { id:"hr15", level:"advanced", q:'Describe a project you are most proud of and why.', a:`"The project I'm most proud of is the BBH — Bangalore Hospital Management System — specifically the Inventory Module and the Staff & Kitchen Order Mobile App.

Why I'm proud of it:

Scale and impact: The system supports a real hospital — real staff, real procurement decisions, real patients impacted indirectly. That stakes level makes engineering quality matter.

Technical challenges: I architected the inventory module from scratch using a microservices architecture with .NET Core and PostgreSQL. I designed the procurement workflow, implemented real-time stock tracking, and built APIs for supplier onboarding. There were real concurrency challenges — preventing double-counting of stock — that I solved with proper transaction management and database-level constraints.

The mobile app: I built a React Native app integrated with Razorpay for staff food orders. It processes 200+ daily transactions with a 99.9% success rate. Getting payment integration right — handling webhook idempotency, transaction failures, refunds — was technically demanding and genuinely satisfying to get right.

Ownership: I worked directly with stakeholders during UAT, handled production support, and saw the product go live. That end-to-end ownership — from design to deployment to support — gave me a complete picture of software engineering.

Result: Reduced manual procurement time by 30%, onboarded 50+ suppliers in Q1. These are real numbers from a live system."` },
  { id:"hr16", level:"intermediate", q:'How do you approach learning a new technology or framework for a project?', a:`"My approach has a few phases:

1. Understand the WHY first: Before diving into syntax, I ask — what problem does this technology solve? What's the mental model? For example, before learning React Query, I understood the problem: manual loading/error state management and lack of caching in useEffect+fetch patterns. Knowing the why makes everything else stick better.

2. Official docs + getting-started: I always start with the official documentation, not third-party tutorials, because it reflects the intended use. I build the canonical 'hello world' to validate my environment.

3. Build something real: I create a small working prototype for our actual use case — not just the tutorial todo app. This surfaces real integration questions quickly.

4. Go deeper when blocked: When I hit a real problem, I dive into GitHub issues, release notes, and source code if needed. This has given me much deeper understanding than following guides.

5. Share it: I do a quick knowledge share or doc write-up for the team. Teaching forces me to fill in gaps I didn't know I had.

Example: When we needed SignalR for real-time alerts, I built a proof of concept with a hub, React client, and Redis backplane in 2 days — then presented it to the team before we committed to it. It helped us decide the approach confidently."` },
  { id:"hr17", level:"intermediate", q:'Why do you want to work at this company specifically?', a:`Always research the company before the interview and personalize this answer. Framework:

1. Something specific about what they BUILD:
"I've been following [Company]'s engineering blog — your post on how you handle X at scale was genuinely impressive. I want to work on problems at that complexity level."

2. Their TECH STACK alignment:
"You're heavily invested in .NET and React, which is exactly my stack. I can contribute immediately while also growing in [new tech they use — e.g., Kubernetes, Kafka]."

3. Their DOMAIN:
"I've spent the last 3 years in healthcare software. I understand the sensitivity, the compliance requirements, and the real-world stakes — which aligns with your work in [fintech / healthtech / SaaS]."

4. GROWTH opportunity:
"The role description mentions architectural ownership and working on distributed systems — that's precisely the direction I want to grow in."

5. CULTURE / VALUES:
"Your engineering culture — the way you've talked about ownership, quality, and developer autonomy — resonates with how I like to work."

Tips:
- Never say "good salary" or "job security" as primary reasons.
- Show you've done homework on their product, tech, or blog.
- Connect their opportunity to your specific goals.` },
  { id:"hr18", level:"beginner", q:'What are your salary expectations?', a:`Research market rates for your role/experience/location first (LinkedIn Salary, Glassdoor, Levels.fyi for product companies).

Three approaches:

1. Defer with a question (gives you information):
"I'd love to understand the full compensation package and role scope before settling on a number. Could you share the budgeted range for this position?"

2. Give a range (anchored to market + a bit above):
"Based on my research and my 3+ years of full-stack .NET/React experience, I'm targeting between ₹X and ₹Y. I'm open to discussing the full compensation picture — benefits, growth opportunities, and learning budget."

3. State your current + expectation (if directly asked):
"I'm currently at ₹X. Based on the scope of this role and what I bring, I'd expect something in the range of ₹Y to ₹Z."

Tips:
- Always give a range, not a single number.
- The top of your range should be your actual target.
- Don't apologize for having expectations.
- Factor in total comp: salary + variable + equity + WFH + learning budget + insurance.
- Don't volunteer your current salary if not required by law in your region.` },
  { id:"hr19", level:"intermediate", q:'Describe a time you failed or made a mistake. What did you learn?', a:`Interviewers respect honesty and growth mindset here. Don't say you've never failed.

STAR Example:

Situation: "Early in my career, I made an architectural mistake in a reporting module — I wrote LINQ queries that materialized entire tables into memory before filtering, not realizing EF Core wasn't translating the filter to SQL."

Task: "This caused the reports page to load slowly and eventually time out under real data volumes."

Action: "When the issue was caught in testing, I immediately acknowledged the mistake in the code review, traced every LINQ query in the module, and rewrote them to filter at the database level using proper IQueryable chains. I also learned to run EXPLAIN ANALYZE on generated SQL before merging any data access code."

Result: "Report load times dropped from 8+ seconds to under 1 second. I shared what I learned in our team retrospective — and the IQueryable vs IEnumerable distinction became part of our team code review checklist."

What I learned: "Always validate the SQL being generated by the ORM, especially for queries on large tables. 'It looks right in code' doesn't mean 'it's efficient at the database.'"

Key: Show accountability (no blame-shifting), specific learning, and that you applied the lesson.` },
  { id:"hr20", level:"advanced", q:'How do you handle a situation where requirements change mid-sprint?', a:`"Requirement changes mid-sprint are reality in software development. My approach:

1. Assess the scope and impact immediately:
Is this a small clarification (handle inline) or a significant change (needs discussion)? I make this assessment before reacting.

2. Communicate transparently:
I surface it to the PM and team immediately: 'This change affects X and Y that I'm already building. It will likely add Z days. Do we still want to proceed this sprint or defer?'

3. Don't silently absorb scope:
I never just say 'yes' and then miss the sprint. That erodes trust. I'd rather have a candid conversation upfront.

4. Protect in-progress work:
If possible, I checkpoint what I have, branch off, and assess whether the change can be layered on top or requires reworking.

5. Update the work item:
Document the change in the sprint ticket with a note on what changed and why — for future reference.

Real example: "Mid-sprint on the supplier portal, the client added a new requirement to support PDF uploads for supplier catalogues. I flagged it immediately — it would need file storage integration (Azure Blob). We agreed to keep the text-based catalogue for that sprint and do the PDF upload feature as a follow-on story. That way the sprint delivered on time and the client got the PDF feature in the next release without chaos."` },
  { id:"hr21", level:"beginner", q:'Are you comfortable working remotely / in a hybrid setup?', a:`Answer honestly, but show you've thought about it professionally.

"Yes, I'm comfortable with both remote and hybrid. In my current role, I've worked in a hybrid setup — and I've developed habits that make remote work productive:

- Async-first communication: I document decisions and context in tickets/docs rather than expecting everyone to be in sync at the same moment.
- Clear availability signals: I keep my calendar and status updated so teammates know when I'm heads-down vs available.
- Over-communicate blockers: Remote work makes blockers less visible, so I surface them proactively in daily standups or Slack rather than waiting for someone to notice.
- Dedicated workspace: I have a proper home office setup — stable internet, good headset, no background distractions.

For collaborative work (whiteboarding architecture, pair programming), I actually find scheduled video calls with screen sharing quite effective. Tools like Figma, Miro, and VS Code Live Share have replaced the whiteboard well for me.

If the role has a preferred setup (full remote, or X days in office), I'm flexible — what does [Company] typically do?"` },
  { id:"hr22", level:"intermediate", q:'How do you ensure code quality in your work?', a:`"Code quality is something I think about at every stage, not just at review time.

During development:
- I follow SOLID principles and think about single responsibility — does this class/method do one thing?
- I write meaningful names: variables, methods, classes should explain themselves without comments.
- I handle edge cases and error states, not just the happy path.
- I write unit tests as I go — especially for business logic with multiple conditions.

Before raising a PR:
- I review my own diff first — I read every line as if I'm the reviewer.
- I check for: debug code left in, magic numbers without constants, missing null checks, N+1 query patterns in EF Core.
- I run the full test suite locally.

Code review:
- I give specific, constructive feedback — 'This might cause a race condition when X' rather than 'This is wrong'.
- I approve only code I'd be comfortable defending in production.

Tools I use: SonarQube / Roslyn analyzers for static analysis, Serilog for structured logging, EXPLAIN ANALYZE for DB query validation.

The defect escape rate below 5% I've maintained is a direct result of these habits.` },
  { id:"hr23", level:"advanced", q:'What is your approach to debugging a production issue under time pressure?', a:`"My production debugging process is fairly systematic, even under pressure — because panicking slows things down more than it helps.

Step 1 — Understand the symptom, not just the report:
What exactly is failing? Who is affected? Since when? Is it 100% of users or specific ones? Recent deployment?

Step 2 — Check monitoring first:
Application Insights / Serilog logs / Grafana — look for error spikes, slow query alerts, memory/CPU anomalies correlated with the incident start time.

Step 3 — Reproduce if possible:
Can I reproduce in staging? If so, I have a safe environment to investigate without touching production.

Step 4 — Isolate the fault:
Narrow down: Is it the API? The DB? An external dependency? Check each layer systematically.

Step 5 — Fix vs mitigate:
Can I apply a quick mitigation (feature flag off, roll back a deploy, clear a cache) to restore service while I work on the root fix? Minimizing user impact comes first.

Step 6 — Fix, test, deploy:
Smallest possible fix. Run tests. Deploy with monitoring eyes on the dashboard.

Step 7 — Post-mortem:
After the fire is out — what caused it? What should we add (test, monitoring, validation) to catch it earlier next time? No blame, just learning.

Real example: A race condition in stock deductions in BBH — I isolated it to concurrent requests within minutes by reading the logs, reproduced it locally, added locking, validated, deployed."` },
  { id:"hr24", level:"intermediate", q:'How do you handle working with non-technical stakeholders?', a:`"Working with non-technical stakeholders is something I genuinely enjoy — bridging technical and business understanding is a valuable skill.

My approach:

1. Translate, don't educate:
I explain things in terms of user impact, not technical mechanisms. Not 'we need to add a database index' but 'right now reports take 8 seconds to load — with this change they'll load in under 1 second.'

2. Ask clarifying questions before building:
'What decision will this report help you make?' often reveals a simpler solution than the feature requested.

3. Manage expectations with transparency:
I give honest timelines with caveats: 'This will take approximately 2 weeks. If the supplier API integration has issues, it could extend to 3 — I'll flag it immediately if that happens.'

4. Show progress incrementally:
I prefer to show working features early (even partial) rather than a big reveal at the end. Stakeholders can give feedback before we've built too far in the wrong direction.

5. UAT participation:
I'm always present during UAT — I learned this on BBH. Being in the room when stakeholders use your software for the first time is invaluable. You catch misunderstood requirements and build empathy for their workflows.

This approach has helped me build trust with clients on all my projects."` },
  { id:"hr25", level:"advanced", q:'What motivates you as a developer?', a:`Be authentic. Some genuine motivations that resonate well:

"A few things genuinely motivate me:

Solving real problems:
The most motivating moments in my career have been when I see software I built actually help people. The hospital inventory module reducing manual procurement work by 30% — that's a real person spending less time on paperwork. That matters.

Technical depth:
I find distributed systems, performance engineering, and database internals genuinely fascinating. When I track down a subtle concurrency bug or optimize a query by 10×, there's real satisfaction in that.

Ownership and craft:
I care about the quality of what I build. Not just 'does it work?' but 'is it maintainable? Is it secure? Will it hold up under load?' Working in environments where quality is valued keeps me engaged.

Learning:
The tech landscape moves fast and I genuinely enjoy keeping up. Learning Fiber architecture, or how Postgres MVCC works under the hood, or why React batches state updates differently in v18 — these things I find interesting, not just required.

Team:
Working with smart people who challenge my assumptions and raise the bar — code reviews where I learn something — that energizes me."` },
  { id:"hr26", level:"beginner", q:'Do you have any questions for us? (Questions to ask the interviewer)', a:`Always have 3-5 thoughtful questions. Never say "No, I think you covered everything."

Technical questions:
1. "What does the tech stack look like in practice — are there parts you're actively migrating or modernizing?"
2. "How does the team handle technical debt? Is there dedicated time for refactoring and improvements?"
3. "What does the CI/CD pipeline look like — how long does it take from a merged PR to production?"

Team / Culture questions:
4. "How does the team typically onboard new developers? What would the first 30-60 days look like for this role?"
5. "How are architectural decisions made — is it a team discussion, tech lead driven, or a mix?"

Growth questions:
6. "What does the career path look like from this role? What does a successful developer typically achieve in the first year?"
7. "Are there opportunities for conference attendance, training, or learning budgets?"

Role-specific:
8. "What are the biggest technical challenges the team is facing right now?"
9. "What does 'success' look like for this role in the first 6 months?"

Avoid asking about: Salary (discuss separately), vacation policy first thing, or anything easily Googleable about the company.` }
];

export default questions;
