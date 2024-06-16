from django.core.management.base import BaseCommand
from guessing.models import GuessCount

class Command(BaseCommand):
    help = 'Resets the guess count to 0'

    def handle(self, *args, **kwargs):
        guess_count = GuessCount.objects.first()
        if guess_count:
            guess_count.count = 0
            guess_count.save()
            self.stdout.write(self.style.SUCCESS('Successfully reset guess count to 0'))
        else:
            GuessCount.objects.create(count=0)
            self.stdout.write(self.style.SUCCESS('Created initial guess count entry and set to 0'))
