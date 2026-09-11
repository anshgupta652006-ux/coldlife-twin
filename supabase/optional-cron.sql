-- Optional: server-side live demo tick every minute.
-- The frontend already performs periodic demo ticks, so this file is not required.
create extension if not exists pg_cron;

do $$
declare j record;
begin
  for j in select jobid from cron.job where jobname = 'coldlife-live-demo' loop
    perform cron.unschedule(j.jobid);
  end loop;
end $$;

select cron.schedule(
  'coldlife-live-demo',
  '* * * * *',
  $$select public.run_live_demo_tick();$$
);
