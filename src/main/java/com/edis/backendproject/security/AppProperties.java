package com.edis.backendproject.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.auth")
public class AppProperties {

	/**
	 * When true, login requests expect SHA-256 hashed passwords (legacy schema).
	 * When false, the backend treats passwords as plain text before encoding.
	 */
	private boolean useSha256Passwords = true;

	/** Default credentials used to bootstrap an admin account when none exists. */
	private String defaultAdminUsername = "admin";
	private String defaultAdminPassword = "123456";

	public boolean isUseSha256Passwords() {
		return useSha256Passwords;
	}

	public void setUseSha256Passwords(boolean useSha256Passwords) {
		this.useSha256Passwords = useSha256Passwords;
	}

	public String getDefaultAdminUsername() {
		return defaultAdminUsername;
	}

	public void setDefaultAdminUsername(String defaultAdminUsername) {
		this.defaultAdminUsername = defaultAdminUsername;
	}

	public String getDefaultAdminPassword() {
		return defaultAdminPassword;
	}

	public void setDefaultAdminPassword(String defaultAdminPassword) {
		this.defaultAdminPassword = defaultAdminPassword;
	}
}
