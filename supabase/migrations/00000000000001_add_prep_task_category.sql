-- Adds a 'prep' task category for pre-move-out work (tenant communication,
-- vendor pre-scheduling, supply checks). Research into the 29-step turnover
-- process found this phase is where most landlords lose the most avoidable
-- time: contractors get booked reactively after vacancy instead of during
-- the notice period, and tenants rarely receive move-out expectations in
-- writing in advance.
alter type public.task_category add value if not exists 'prep' before 'inspection';
