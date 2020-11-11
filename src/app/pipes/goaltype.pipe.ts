import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'goalType'
})
export class GoaltypePipe implements PipeTransform {

    transform(value: string): string {
        if (value == 'steps') return "Steps";
        else if (value == 'sleepDuration') return "Sleep";
        else if (value == 'calories') return "Calories";
        else if (value == 'exerciseMinutes') return "Exercise";
    }

}
