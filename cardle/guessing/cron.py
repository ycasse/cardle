from django_cron import CronJobBase, Schedule
from .models import GuessCount

class ResetCountCronJob(CronJobBase):
    RUN_EVERY_MINS = 1  # Run every 1 minute for testing purposes

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'your_app.reset_count_cron_job'    # a unique code

    def do(self):
        guess_count, created = GuessCount.objects.get_or_create(id=1)
        guess_count.count = 0
        guess_count.save()
        print("reset has been done")
