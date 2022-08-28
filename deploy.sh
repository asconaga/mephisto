#!/bin/bash
cd client
npm run build
scp -r build/* testpig@20.12.202.229:/var/www/react