---
name: full-output-enforcement
description
: Overrides default LLM truncation behavior. 
Enforces complete code generation, bans place
holder patterns, and handles token-limit spli
ts cleanly. Apply to any task requiring exhau
stive, unabridged output.
---

# Full-Output 
Enforcement

## Baseline

Treat every task as
 production-critical. A partial output is a b
roken output. Do not optimize for brevity —
 optimize for completeness. If the user asks 
for a full file, deliver the full file. If th
e user asks for 5 components, deliver 5 compo
nents. No exceptions.

## Banned Output Patte
rns

The following patterns are hard failures
. Never produce them:

**In code blocks:** `/
/ ...`, `// rest of code`, `// implement here
`, `// TODO`, `/* ... */`, `// similar to abo
ve`, `// continue pattern`, `// add more as n
eeded`, bare `...` standing in for omitted co
de

**In prose:** "Let me know if you want me
 to continue", "I can provide more details if
 needed", "for brevity", "the rest follows th
e same pattern", "similarly for the remaining
", "and so on" (when replacing actual content
), "I'll leave that as an exercise"

**Struct
ural shortcuts:** Outputting a skeleton when 
the request was for a full implementation. Sh
owing the first and last section while skippi
ng the middle. Replacing repeated logic with 
one example and a description. Describing wha
t code should do instead of writing it.

## E
xecution Process

1. **Scope** — Read the f
ull request. Count how many distinct delivera
bles are expected (files, functions, sections
, answers). Lock that number.
2. **Build** �
� Generate every deliverable completely. No p
artial drafts, no "you can extend this later.
"
3. **Cross-check** — Before output, re-re
ad the original request. Compare your deliver
able count against the scope count. If anythi
ng is missing, add it before responding.

## 
Handling Long Outputs

When a response approa
ches the token limit:

- Do not compress rema
ining sections to squeeze them in.
- Do not s
kip ahead to a conclusion.
- Write at full qu
ality up to a clean breakpoint (end of a func
tion, end of a file, end of a section).
- End
 with:

```
[PAUSED — X of Y complete. Send
 "continue" to resume from: next section name
]
```

On "continue", pick up exactly where y
ou stopped. No recap, no repetition.

## Quic
k Check

Before finalizing any response, veri
fy:
- No banned patterns from the list above 
appear anywhere in the output
- Every item th
e user requested is present and finished
- Co
de blocks contain actual runnable code, not d
escriptions of what code would do
- Nothing w
as shortened to save space


