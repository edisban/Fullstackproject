package com.edis.backendproject.config;

/**
 * Central cache name constants to avoid typos and keep TTL tuning consistent.
 */
public final class CacheNames {

    private CacheNames() {
    }

    public static final String PROJECTS = "projects";
    public static final String STUDENTS = "students";
    public static final String METADATA = "metadata";
}
