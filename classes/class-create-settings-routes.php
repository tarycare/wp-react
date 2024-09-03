<?php

class WP_React_Settings_Rest_Route
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'create_rest_routes']);
    }

    public function create_rest_routes()
    {
        register_rest_route('doc/v1', '/add', [
            'methods' => 'POST',
            'callback' => [$this, 'add_doc'],
            'permission_callback' => '__return_true' // Allows access for all authenticated users
        ]);
    }

    public function add_doc($req)
    {
        $files = $_FILES;
        $responses = [];

        foreach ($files as $key => $file) {
            if (!isset($file['name']) || !$file['name']) {
                $responses[] = ['error' => true, 'message' => 'File name is missing or invalid.'];
                continue;
            }

            $attachment_id = $this->upload_file_to_media_library($key, $file);
            if (is_wp_error($attachment_id)) {
                $responses[] = ['error' => true, 'message' => $attachment_id->get_error_message()];
                continue;
            }

            $doc_type = sanitize_text_field($req->get_param('doc_type_' . str_replace('file_', '', $key)));
            $module_type = sanitize_text_field($req->get_param('module_type_' . str_replace('file_', '', $key)));

            $post_id = wp_insert_post([
                'post_title' => $doc_type ?: 'Untitled Document',
                'post_content' => $module_type,
                'post_status' => 'publish',
                'post_type' => 'doc',
            ]);

            if ($post_id) {
                update_post_meta($post_id, 'attachment_id', $attachment_id);
                $responses[] = ['error' => false, 'message' => 'Document added successfully', 'post_id' => $post_id];
            } else {
                $responses[] = ['error' => true, 'message' => 'Failed to create document post.'];
            }
        }

        return rest_ensure_response($responses);
    }

    private function upload_file_to_media_library($key, $file)
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return new WP_Error('upload_error', 'Error uploading file: ' . $file['error']);
        }

        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');

        $overrides = ['test_form' => false];
        $attachment_id = media_handle_upload($key, 0, $overrides);  // Correct key is used

        if (is_wp_error($attachment_id)) {
            return $attachment_id; // Return any upload errors
        }

        return $attachment_id;
    }
}

new WP_React_Settings_Rest_Route();
