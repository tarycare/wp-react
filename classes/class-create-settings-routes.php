<?php

/**
 * This file will create Custom Rest API End Points.
 */
class WP_React_Settings_Rest_Route
{

    public function __construct()
    {
        add_action('rest_api_init', [$this, 'create_rest_routes']);
    }

    public function create_rest_routes()
    {
        register_rest_route('wprk/v1', '/settings', [
            'methods' => 'GET',
            'callback' => [$this, 'get_settings'],
            'permission_callback' => [$this, 'get_settings_permission']
        ]);
        register_rest_route('doc/v1', '/add', [
            'methods' => 'POST',
            'callback' => [$this, 'add_doc'],
            'permission_callback' => [$this, 'save_settings_permission']
        ]);
    }

    public function get_settings()
    {
        $firstname = get_option('wprk_settings_firstname');
        $lastname  = get_option('wprk_settings_lastname');
        $email     = get_option('wprk_settings_email');
        $response = [
            'firstname' => $firstname,
            'lastname'  => $lastname,
            'email'     => $email
        ];

        return rest_ensure_response($response);
    }

    public function get_settings_permission()
    {
        return true;
    }

    public function add_doc($req)
    {

        // it will uplade custom post type image_url doc_type moudle_type

        $request = json_decode($req->get_body());
        $doc_type = $request->doc_type;
        $moudle_type = $request->moudle_type;
        $image_url = $request->image_url;
        $post_id = wp_insert_post(array(
            'post_title' => $doc_type,
            'post_content' => $moudle_type,
            'post_status' => 'publish',
            'post_type' => 'doc',
        ));
        if ($post_id) {
            update_post_meta($post_id, 'image_url', $image_url);
            return rest_ensure_response('Document Added Successfully');
        } else {
            return rest_ensure_response('Error in Adding Document');
        }
    }

    public function save_settings_permission()
    {
        return current_user_can('publish_posts');
    }
}
new WP_React_Settings_Rest_Route();
