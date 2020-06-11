#!/bin/bash
npm run build:prod
docker build -t test-cust-sat .