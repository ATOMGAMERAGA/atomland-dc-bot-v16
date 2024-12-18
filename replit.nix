{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x # Node.js sürümünüzü belirtin
    pkgs.libuuid     # libuuid kütüphanesini ekler
  ];
}
