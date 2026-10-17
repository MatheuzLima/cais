// Single source of truth for the product identity of this fork.
// branding.json is also read by webpack to fill index.html / timeout.ejs.
import branding from './branding.json';

export const APP_NAME = branding.name;
export const APP_DESCRIPTION = branding.description;
export const UPSTREAM_NAME = branding.upstreamName;
export const UPSTREAM_URL = branding.upstreamUrl;
export const REPOSITORY_URL = branding.repositoryUrl;
export const THEME_COLOR = branding.themeColor;
// When false, Kubernetes and cloud (ACI) environments are not offered in the UI
export const ENABLE_KUBERNETES = branding.enableKubernetes;
