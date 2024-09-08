package controllers

import (
	"DnDCharacterSheet/env"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
)

func InitProxy(r *gin.Engine) {
	proxy := func(c *gin.Context) {
		target := env.GetFrontendURL() // URL of the Express server (http://localhost:3000)
		proxyURL, err := url.Parse(target)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse proxy URL"})
			return
		}

		// Create the reverse proxy
		p := httputil.NewSingleHostReverseProxy(proxyURL)
		c.Request.URL.Host = proxyURL.Host
		c.Request.URL.Scheme = proxyURL.Scheme
		c.Request.Header.Set("X-Forwarded-For", c.ClientIP())
		p.ServeHTTP(c.Writer, c.Request)
	}

	// Define the routes
	//r.GET("/", proxy)

	// Forward all GET requests to the Express server

	// frontend routes
	r.NoRoute(proxy)
}
