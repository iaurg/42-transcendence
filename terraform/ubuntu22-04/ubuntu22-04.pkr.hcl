locals {
  buildtime = formatdate("YYYY-MM-DDHH:mm", timestamp())
}

source "vsphere-iso" "ubuntu22-04" {
  username       = var.vcenter_user
  password       = var.vcenter_password
  vcenter_server = var.vcenter_server
  datacenter     = var.vcenter_datacenter
  datastore      = var.vcenter_datastore
  host           = ""
  cluster        = var.vcenter_cluster
  folder         = "templates"

  insecure_connection  = true
  tools_upgrade_policy = true
  remove_cdrom         = true
  convert_to_template  = true
  notes                = "Built with Packer on ${local.buildtime}."

  vm_name = "ubuntu22.04-${local.buildtime}"
  CPUs    = "2"
  RAM     = "2048"
  storage {
    disk_size             = "32768"
    disk_thin_provisioned = true
  }
  network_adapters {
    network = var.vcenter_network
  }
  iso_urls = [
    "./iso/ubuntu-22.04.2-live-server-amd64.iso",
    "https://releases.ubuntu.com/22.04.2/ubuntu-22.04.2-live-server-amd64.iso"
  ]
  iso_checksum    = "5e38b55d57d94ff029719342357325ed3bda38fa80054f9330dc789cd2d43931"
  iso_target_path = "./iso"
  boot_wait       = "5s"
  cd_files        = ["./http/meta-data", "./http/user-data"]
  cd_label        = "cidata"
  boot_command = [
    "<esc><esc><esc><esc>e<wait>",
    "<del><del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "<del><del><del><del><del><del><del><del>",
    "linux /casper/vmlinuz --- autoinstall ds=\"nocloud-net;seedfrom=https://raw.githubusercontent.com/caio-vinicius/cloud-init/master/ubuntu22-04/http/\"<enter><wait>",
    "initrd /casper/initrd<enter><wait>",
    "boot<enter>",
    "<enter><f10><wait>"
  ]
  ip_wait_timeout        = "10m"
  ssh_username           = "ubuntu"
  ssh_password           = "ubuntu"
  ssh_timeout            = "30m"
  ssh_port               = 22
  ssh_handshake_attempts = "100"
  shutdown_command       = "sudo shutdown -P now"
  shutdown_timeout       = "10m"
  guest_os_type          = "ubuntu64Guest"
}

build {
  sources = [
    "source.vsphere-iso.ubuntu22-04"
  ]

  #provisioner "ansible" {
  #  playbook_file = "./ansible/playbook.yml"
  #}
}
