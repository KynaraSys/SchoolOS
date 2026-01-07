<?php

return [

    /*
     * A policy will determine which CSP headers will be set. A valid CSP policy is
     * any class that extends `Spatie\Csp\Policies\Policy`
     */
    'policy' => App\Support\Csp\Basic::class,

    /**
     * Register additional global CSP directives here.
     */
    'directives' => [
        //
    ],

    /*
     * These presets which will be put in a report-only policy. This is great for testing out
     * a new policy or changes to existing CSP policy without breaking anything.
     */
    'report_only_presets' => [
        //
    ],

    /**
     * Register additional global report-only CSP directives here.
     */
    'report_only_directives' => [
        //
    ],

    'report_uri' => env('CSP_REPORT_URI', ''),

    'enabled' => env('CSP_ENABLED', true),

    'enabled_while_hot_reloading' => env('CSP_ENABLED_WHILE_HOT_RELOADING', false),

    'nonce_generator' => Spatie\Csp\Nonce\RandomString::class,

    'nonce_enabled' => env('CSP_NONCE_ENABLED', true),
];
