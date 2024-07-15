FROM wordpress:latest as bundle

# Install unzip package
RUN apt-get update && apt-get install -y unzip

# Install WooCommerce plugin
RUN curl -o /tmp/woocommerce.zip -L https://downloads.wordpress.org/plugin/woocommerce.latest-stable.zip && \
    unzip /tmp/woocommerce.zip -d /var/www/html/wp-content/plugins/ && \
    rm /tmp/woocommerce.zip

# Ensure proper ownership and permissions
RUN chown -R www-data:www-data /var/www/html/wp-content/plugins/woocommerce