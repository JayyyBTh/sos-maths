FROM php:8.2-apache

# Enable Apache modules
RUN a2enmod rewrite headers

# Install libraries needed for PHP extensions + PostgreSQL driver
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libzip-dev zip unzip \
    libpq-dev \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install gd zip \
    pdo pdo_pgsql pgsql \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

