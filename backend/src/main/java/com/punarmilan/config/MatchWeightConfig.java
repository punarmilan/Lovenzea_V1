package com.punarmilan.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Externalized match-scoring configuration.
 * All values are read from application.properties (prefix "match").
 * Weights, boosts, penalties and pool sizes can be tuned at runtime
 * without recompiling.
 */
@Configuration
@ConfigurationProperties(prefix = "match")
@Data
public class MatchWeightConfig {

    private Weight weight = new Weight();
    private Boost boost = new Boost();
    private Penalty penalty = new Penalty();
    private Rotation rotation = new Rotation();
    private Candidate candidate = new Candidate();

    @Data
    public static class Weight {
        private int age = 20;
        private int religion = 20;
        private int location = 15;
        private int education = 15;
        private int occupation = 10;
        private int income = 10;
        private int height = 5;
        private int lifestyle = 5;
    }

    @Data
    public static class Boost {
        private int activeNow = 10;
        private int activeToday = 5;
        private int popularityMax = 10;
    }

    @Data
    public static class Penalty {
        private int rejected = 20;
    }

    @Data
    public static class Rotation {
        private int excludeDays = 3;
    }

    @Data
    public static class Candidate {
        private int poolSize = 200;
    }
}
