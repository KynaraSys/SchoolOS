<?php

namespace App\Support\Csp;

use Spatie\Csp\Directive;
use Spatie\Csp\Policy;

class Basic extends Policy
{
    public function configure()
    {
        $this
            ->addDirective(Directive::BASE, 'self')
            ->addDirective(Directive::CONNECT, 'self')
            ->addDirective(Directive::DEFAULT, 'self')
            ->addDirective(Directive::FORM_ACTION, 'self')
            ->addDirective(Directive::IMG, 'self')
            ->addDirective(Directive::MEDIA, 'self')
            ->addDirective(Directive::OBJECT, 'none')
            ->addDirective(Directive::SCRIPT, 'self')
            ->addDirective(Directive::STYLE, 'self')
            // Allow inline scripts/styles for development (usually needed for Pulse/Telescope/Error pages)
            ->addDirective(Directive::SCRIPT, 'unsafe-inline')
            ->addDirective(Directive::STYLE, 'unsafe-inline');
    }
}
