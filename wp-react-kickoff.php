<?php

/**
 * Plugin Name: WP React KickOff
 * Author: Husam nasrallah
 * Author URI: https://github.com/robicse11127
 * Version: 1.0.1
 * Description: WordPress React KickOff.
 * Text-Domain: wp-react-kickoff
 */

if (! defined('ABSPATH')) : exit();
endif; // No direct access allowed.

/**
 * Define Plugins Contants
 */
define('WPRK_PATH', trailingslashit(plugin_dir_path(__FILE__)));
define('WPRK_URL', trailingslashit(plugins_url('/', __FILE__)));

/**
 * Loading Necessary Scripts
 */
add_action('admin_enqueue_scripts', 'load_scripts');
function load_scripts()
{
    $is_dev = defined('WP_DEBUG') && WP_DEBUG;

    if ($is_dev) {
        // Load from Webpack Dev Server
        wp_enqueue_script('wp-react-kickoff', 'http://localhost:8080/dist/bundle.js', ['jquery', 'wp-element'], wp_rand(), true);
        wp_enqueue_style('wp-react-kickoff-style', 'http://localhost:8080/dist/style.css', [], wp_rand());
    } else {
        // Load the production bundle from the plugin directory
        wp_enqueue_script('wp-react-kickoff', WPRK_URL . 'dist/bundle.js', ['jquery', 'wp-element'], wp_rand(), true);
        wp_enqueue_style('wp-react-kickoff-style', WPRK_URL . 'dist/style.css', [], wp_rand());
    }

    wp_localize_script('wp-react-kickoff', 'appLocalizer', [
        'apiUrl' => home_url('/wp-json'),
        'nonce' => wp_create_nonce('wp_rest'),
    ]);
}


require_once WPRK_PATH . 'classes/class-create-admin-menu.php';
require_once WPRK_PATH . 'classes/class-create-settings-routes.php';
