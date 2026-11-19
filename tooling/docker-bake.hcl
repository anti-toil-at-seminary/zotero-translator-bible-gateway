
variable "BASEFILE" {
  default = ".task/Dockerfile.base"
}

variable "HOST_UID" {
    default = 1000
}

variable "HOST_GID" {
    default = 1000
}

group "default" {
  targets = ["workImg"]
}

target "base" {
  dockerfile = BASEFILE
  tags = ["testbg-base:latest"]
}

target "workImg" {
  dockerfile = "tooling/Dockerfile"
  tags = ["testbg:latest", "zotero-translator-bible-gateway-testing:latest"]
  context = "."
  args = {
    USER_UID = "${HOST_UID}"
    USER_GID = "${HOST_GID}"
  }
  contexts = {
    base = "target:base"
  }
}
