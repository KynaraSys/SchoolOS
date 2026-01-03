<?php

namespace App\Services;

class PredictionService
{
    /**
     * Predict the next value using Linear Regression (Least Squares Method).
     *
     * @param array $history Array of values (y-axis). Keys are treated as time steps (x-axis).
     * @return float|null Predicted value for the next step, or null if insufficient data.
     */
    public function predictNextValue(array $history)
    {
        $n = count($history);
        
        if ($n < 2) {
            return null; // Need at least 2 points for a line
        }

        // X = Time steps (0, 1, 2... n-1)
        // Y = Values
        
        $sumX = 0;
        $sumY = 0;
        $sumXY = 0;
        $sumXX = 0;

        foreach ($history as $x => $y) {
            $sumX += $x;
            $sumY += $y;
            $sumXY += ($x * $y);
            $sumXX += ($x * $x);
        }

        // Slope (m) = (n*Σxy - Σx*Σy) / (n*Σx² - (Σx)²)
        $numerator = ($n * $sumXY) - ($sumX * $sumY);
        $denominator = ($n * $sumXX) - ($sumX * $sumX);

        if ($denominator == 0) {
            return null; // Vertical line (undefined slope)
        }

        $slope = $numerator / $denominator;

        // Y-intercept (b) = (Σy - m*Σx) / n
        $intercept = ($sumY - ($slope * $sumX)) / $n;

        // Predict for x = n (the next step)
        $nextX = $n;
        $prediction = ($slope * $nextX) + $intercept;

        return [
            'value' => round($prediction, 1),
            'slope' => $slope, // Useful to determine trend direction (+/-)
            'intercept' => $intercept
        ];
    }
}
