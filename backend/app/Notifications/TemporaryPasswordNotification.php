<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TemporaryPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $plainPassword;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $plainPassword)
    {
        $this->plainPassword = $plainPassword;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // Add 'vonage' or 'twilio' here if SMS is integrated
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Your Temporary Password')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('Your account has been created/reset. Please use the following temporary password to log in:')
                    ->line('Password: ' . $this->plainPassword)
                    ->line('You will be required to change your password upon your first login.')
                    ->action('Login to Portal', url('/login')) // Adjust URL as per frontend
                    ->line('If you did not request this, please contact the school administration immediately.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'temporary_password',
            'message' => 'A temporary password has been sent to your email.',
            // Do not store the actual password in database!
        ];
    }
}
