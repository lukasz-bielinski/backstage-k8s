# Define variables for docker image name and tag
IMAGE_NAME := lukaszbielinski/backstage
IMAGE_TAG := 1.0.1

# Default target executed when no arguments are given to make
all: build-backend build-image push-image
all-no-cache: build-backend build-image-no-cache push-image

# Target for building the backend
build-backend:
	yarn build:backend

# Target for building the docker image without cache
build-image-no-cache:
	docker image build . --no-cache -f packages/backend/Dockerfile -t $(IMAGE_NAME):$(IMAGE_TAG)

build-image:
	docker image build .  -f packages/backend/Dockerfile -t $(IMAGE_NAME):$(IMAGE_TAG)

# Target for pushing the docker image
push-image:
	docker push $(IMAGE_NAME):$(IMAGE_TAG)

# Phony targets
.PHONY: all build-backend build-image-no-cache push-image
