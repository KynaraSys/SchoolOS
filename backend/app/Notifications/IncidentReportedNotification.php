<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IncidentReportedNotification extends Notification
{
    use Queueable;

    protected $incident;

    /**
     * Create a new notification instance.
     */
    public function __construct($incident)
    {
        $this->incident = $incident;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'incident_id' => $this->incident->id,
            'title' => $this->incident->title,
            'description' => $this->incident->description,
            'severity' => $this->incident->severity,
            'occurred_at' => $this->incident->occurred_at,
            'student_name' => $this->incident->student->first_name . ' ' . $this->incident->student->last_name,
            'type' => 'disciplinary_incident',
            'message' => "A disciplinary incident has been recorded for your child: {$this->incident->title}"
        ];
    }
}
