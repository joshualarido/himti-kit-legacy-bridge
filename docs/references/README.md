# Design References

The six PNG files in this directory are available in the workspace and are the visual source of truth for Stage 2. Read `docs/plan.md` for the distinction between confirmed product requirements, visible screenshot observations, implementation proposals, and unresolved decisions.

## Inventory

| File | Visible screen or state |
| --- | --- |
| `Desktop - 1.png` | Illustrated HIMTI KIT student-ID entry screen. |
| `Desktop - 2.png` | Dark futuristic student dashboard mockup with identity panel, Course/Software navigation, major and semester controls, cards, and logout. Semester controls are visible reference content but intentionally omitted from the product. |
| `Screenshot 2026-09-06 210216.png` | Green student Course dashboard and logout-confirmation state. |
| `Screenshot 2026-09-06 210232.png` | Green student Software dashboard with downloadable resource cards. |
| `Screenshot 2026-09-06 210255.png` | Admin login layout and management navigation; the pictured cohort selector is intentionally omitted from login. |
| `Screenshot 2026-09-06 210312.png` | Admin Course management list with cohort context and add, change, edit, and delete actions. |

## Interpretation Rules

- Match the applicable reference's hierarchy, composition, visual identity, controls, and content-card structure closely.
- Screenshots establish visible presentation, not unseen backend behavior.
- Names, IDs, passwords, cohorts, courses, software, and other records shown in screenshots are examples unless `docs/plan.md` marks them as confirmed.
- Semester controls shown in the references must be omitted because course summaries have no semester data.
- Images associated with lesson summaries and software resources must use external URLs; image upload interfaces are out of scope.
- Where references conflict, do not silently choose one. Follow the precedence or open decision documented in `docs/plan.md` and ask the product owner when required.
- Responsive, accessible, validation, loading, empty, and error states may be added where static desktop screenshots do not provide them.
- Do not overwrite or edit these source images directly.
