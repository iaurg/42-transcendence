variable "vcenter_user" {
  description = "vCenter user"
  type = string
  default     = ""
}

variable "vcenter_password" {
  description = "vCenter password"
  type = string
  default     = ""
}

variable "vcenter_server" {
  description = "vCenter server"
  type = string
  default     = ""
}

variable "vcenter_datacenter" {
  description = "vCenter datacenter"
  type = string
  default     = ""
}

variable "vcenter_datastore" {
  description = "vCenter datastore"
  type = string
  default     = ""
}

variable "vcenter_cluster" {
  description = ""
  type = string
  default     = ""
}

variable "vcenter_network" {
  description = "vCenter network"
  type = string
  default     = ""
}
