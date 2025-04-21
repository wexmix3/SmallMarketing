<?php
/**
 * Plugin Name: AI Customer Service Assistant
 * Plugin URI: https://aiassistant.com/wordpress
 * Description: Add an AI-powered customer service assistant to your WordPress site.
 * Version: 1.0.0
 * Author: AI Assistant Team
 * Author URI: https://aiassistant.com
 * Text Domain: ai-assistant
 * License: GPL-2.0+
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define plugin constants
define('AI_ASSISTANT_VERSION', '1.0.0');
define('AI_ASSISTANT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('AI_ASSISTANT_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * The code that runs during plugin activation.
 */
function activate_ai_assistant() {
    // Add default options
    add_option('ai_assistant_id', '');
    add_option('ai_assistant_position', 'bottom-right');
    add_option('ai_assistant_primary_color', '#0071e3');
}
register_activation_hook(__FILE__, 'activate_ai_assistant');

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_ai_assistant() {
    // Nothing to do here
}
register_deactivation_hook(__FILE__, 'deactivate_ai_assistant');

/**
 * Enqueue scripts and styles.
 */
function ai_assistant_enqueue_scripts() {
    // Get options
    $assistant_id = get_option('ai_assistant_id');
    
    // Only load if assistant ID is set
    if (!empty($assistant_id)) {
        wp_enqueue_script(
            'ai-assistant-embed',
            'https://cdn.aiassistant.com/embed.js',
            array(),
            AI_ASSISTANT_VERSION,
            true
        );
        
        // Add configuration
        wp_add_inline_script(
            'ai-assistant-embed',
            'window.aiAssistantConfig = {
                id: "' . esc_js($assistant_id) . '",
                position: "' . esc_js(get_option('ai_assistant_position', 'bottom-right')) . '",
                primaryColor: "' . esc_js(get_option('ai_assistant_primary_color', '#0071e3')) . '"
            };',
            'before'
        );
    }
}
add_action('wp_enqueue_scripts', 'ai_assistant_enqueue_scripts');

/**
 * Add settings page to the admin menu.
 */
function ai_assistant_add_admin_menu() {
    add_options_page(
        'AI Assistant Settings',
        'AI Assistant',
        'manage_options',
        'ai-assistant',
        'ai_assistant_settings_page'
    );
}
add_action('admin_menu', 'ai_assistant_add_admin_menu');

/**
 * Register settings.
 */
function ai_assistant_register_settings() {
    register_setting('ai_assistant_settings', 'ai_assistant_id');
    register_setting('ai_assistant_settings', 'ai_assistant_position');
    register_setting('ai_assistant_settings', 'ai_assistant_primary_color');
}
add_action('admin_init', 'ai_assistant_register_settings');

/**
 * Settings page callback.
 */
function ai_assistant_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('ai_assistant_settings');
            do_settings_sections('ai_assistant_settings');
            ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Assistant ID</th>
                    <td>
                        <input type="text" name="ai_assistant_id" value="<?php echo esc_attr(get_option('ai_assistant_id')); ?>" />
                        <p class="description">Enter your AI Assistant ID from your dashboard.</p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Position</th>
                    <td>
                        <select name="ai_assistant_position">
                            <option value="bottom-right" <?php selected(get_option('ai_assistant_position'), 'bottom-right'); ?>>Bottom Right</option>
                            <option value="bottom-left" <?php selected(get_option('ai_assistant_position'), 'bottom-left'); ?>>Bottom Left</option>
                            <option value="top-right" <?php selected(get_option('ai_assistant_position'), 'top-right'); ?>>Top Right</option>
                            <option value="top-left" <?php selected(get_option('ai_assistant_position'), 'top-left'); ?>>Top Left</option>
                        </select>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Primary Color</th>
                    <td>
                        <input type="color" name="ai_assistant_primary_color" value="<?php echo esc_attr(get_option('ai_assistant_primary_color', '#0071e3')); ?>" />
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

/**
 * Shortcode for embedding the assistant.
 */
function ai_assistant_shortcode($atts) {
    $atts = shortcode_atts(
        array(
            'id' => get_option('ai_assistant_id'),
            'position' => get_option('ai_assistant_position', 'bottom-right'),
            'color' => get_option('ai_assistant_primary_color', '#0071e3'),
        ),
        $atts,
        'ai_assistant'
    );
    
    // Only output if ID is set
    if (empty($atts['id'])) {
        return '<p>Please set your AI Assistant ID in the settings or shortcode.</p>';
    }
    
    // Add configuration
    wp_enqueue_script(
        'ai-assistant-embed',
        'https://cdn.aiassistant.com/embed.js',
        array(),
        AI_ASSISTANT_VERSION,
        true
    );
    
    wp_add_inline_script(
        'ai-assistant-embed',
        'window.aiAssistantConfig = {
            id: "' . esc_js($atts['id']) . '",
            position: "' . esc_js($atts['position']) . '",
            primaryColor: "' . esc_js($atts['color']) . '"
        };',
        'before'
    );
    
    return '<div class="ai-assistant-container"></div>';
}
add_shortcode('ai_assistant', 'ai_assistant_shortcode');

/**
 * Function to embed the assistant programmatically.
 */
function ai_assistant_embed($id = null, $position = null, $color = null) {
    // Use provided values or defaults
    $id = $id ?: get_option('ai_assistant_id');
    $position = $position ?: get_option('ai_assistant_position', 'bottom-right');
    $color = $color ?: get_option('ai_assistant_primary_color', '#0071e3');
    
    // Only output if ID is set
    if (empty($id)) {
        echo '<p>Please set your AI Assistant ID.</p>';
        return;
    }
    
    // Add configuration
    wp_enqueue_script(
        'ai-assistant-embed',
        'https://cdn.aiassistant.com/embed.js',
        array(),
        AI_ASSISTANT_VERSION,
        true
    );
    
    wp_add_inline_script(
        'ai-assistant-embed',
        'window.aiAssistantConfig = {
            id: "' . esc_js($id) . '",
            position: "' . esc_js($position) . '",
            primaryColor: "' . esc_js($color) . '"
        };',
        'before'
    );
    
    echo '<div class="ai-assistant-container"></div>';
}
