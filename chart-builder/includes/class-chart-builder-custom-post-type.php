<?php
/**
 * The admin-facing custom post type functionality of the plugin.
 *
 * @link       http://ays-pro.com/
 * @since      6.6.9.4
 *
 * @package    Chart-Builder
 * @subpackage  Chart-Builder/includes
 */

/**
 * The admin-facing custom post type functionality of the plugin.
 *
 * Defines the plugin name, version, flush version, name prefix
 *
 * @package     Chart-Builder
 * @subpackage  Chart-Builder/includes
 * @author     AYS Pro LLC <info@ays-pro.com>
 */
class  Chart_Builder_Custom_Post_Type {

    private $plugin_name;
    private $version;
    private $ays_chart_flush_version;
    public  $name_prefix;

    public function __construct($plugin_name, $version){
        $this->plugin_name = $plugin_name;
        $this->name_prefix = 'ays-';
        $this->version = $version;
        $this->ays_chart_flush_version = '1.0.0';
        add_action( 'init', array( $this, 'ays_chart_register_custom_post_type' ) );
    }

    public function ays_chart_register_custom_post_type(){
        $args = array(
            'public'  => true,
            'rewrite' => true,
            'show_in_menu' => false,
            'exclude_from_search' => false, 
            'show_ui' => false,
            'show_in_nav_menus' => false,
            'show_in_rest' => false
        );

        register_post_type( $this->name_prefix . $this->plugin_name, $args );
        $this->ays_chart_custom_rewrite_rule();
        $this->ays_chart_flush_permalinks();
    }

    public static function ays_chart_add_custom_post($args, $update = true){
        
        $chart_id    = (isset($args['chart_id']) && $args['chart_id'] != '' && $args['chart_id'] != 0) ? esc_attr($args['chart_id']) : '';
        $chart_title = (isset($args['chart_title']) && $args['chart_title'] != '') ? esc_attr($args['chart_title']) : '';
        $author_id  = (isset($args['author_id']) && $args['author_id'] != '') ? esc_attr($args['author_id']) : get_current_user_id();

        $post_content = '[ays_chart id="'.$chart_id.'"]';

        $new_post = array(
            'post_title'    => $chart_title,
            'post_author'   => $author_id,
            'post_type'     => 'ays-chart-builder', 
            'post_content'  => $post_content,
            'post_status'   => 'draft',
            'post_date'     => current_time( 'mysql' ),
        );


        $post_id = wp_insert_post($new_post);
        if($update){
            if(isset($post_id) && $post_id > 0){
                self::update_charts_table_custom_post_id($post_id, $chart_id);
            }
        }
        return $post_id;
    }

    public static function update_charts_table_custom_post_id($custom_post_id, $chart_id){
        global $wpdb;
        $table = esc_sql( $wpdb->prefix . "ayschart_charts" );
        $result = $wpdb->update(// phpcs:ignore WordPress.DB.DirectDatabaseQuery
            $table,
            array('custom_post_id' => $custom_post_id),
            array('id' => $chart_id),
            array('%d'),
            array('%d')
        );
    }

    public function ays_chart_flush_permalinks(){
        if ( get_site_option( 'ays_chart_flush_version' ) != $this->ays_chart_flush_version ) {
            flush_rewrite_rules();
        }
        update_option( 'ays_chart_flush_version', $this->ays_chart_flush_version );            
    }
    
    public function ays_chart_custom_rewrite_rule() {
        add_rewrite_rule(
            'ays-chart-builder/([^/]+)/?',
            'index.php?post_type=chart-builder&name=$matches[1]',
            'top'
        );
    }
}
