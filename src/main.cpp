#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPUpdateServer.h> // nạp chương trình qua wifi
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

ESP8266WebServer sv(80);
ESP8266HTTPUpdateServer u;      // nạp chương trình qua wifi
WebSocketsServer webSocket(81); // create a websocket server on port 81
unsigned long tglm = 1000000;
boolean bat = false;
#include "ham.h"
#include "data.h"

#include "sk.h"

void startWifi()
{
  String tenWifiPhat = "osi";
  String passWifiPhat = "12345678";

  String tenWifiBat = "Tuyen T1";
  String passWifiBat = "0978333563";
  tglm = 1000000;

  String s = getFile("caidat.json");
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, s);
  if (error)
  {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
  }
  else
  {
    tenWifiPhat = String(doc["tf"]);
    passWifiPhat = String(doc["pf"]);
    tenWifiBat = String(doc["tb"]);
    passWifiBat = String(doc["pb"]);
    tglm = String(doc["T"]).toInt();
  }

  WiFi.softAPdisconnect();
  WiFi.disconnect();

  WiFi.mode(WIFI_AP_STA);

  if (passWifiPhat.length() >= 8)
  {
    WiFi.softAP(tenWifiPhat, passWifiPhat);
  }
  else
  {
    WiFi.softAP(tenWifiPhat);
  }

  WiFi.begin(tenWifiBat, passWifiBat);

  // nếu lỗi kết nối chỉ phát chế độ AP
  if (WiFi.waitForConnectResult() != WL_CONNECTED)
  {
    WiFi.softAPdisconnect();
    WiFi.disconnect();
    WiFi.mode(WIFI_AP);
    delay(100);

    if (passWifiPhat.length() >= 8)
    {
      WiFi.softAP(tenWifiPhat, passWifiPhat);
    }
    else
    {
      WiFi.softAP(tenWifiPhat);
    }

    Serial.println(WiFi.softAPIP());
  }
  else
  {
    Serial.print("Ket noi wifi: ");
    Serial.println(tenWifiBat);
    Serial.print("Dia chi IP: http://");
    Serial.println(WiFi.localIP());
  }

  u.setup(&sv); // nạp chương trình qua wifi
}

void startServer()
{
  sv.on("/", []()
        { GuiFile("index.html"); });

  sv.on("/s", []()
        { GuiFile("setting.html"); });

  sv.on("/r", []()
        {
          startWifi();
          //  ESP.restart();
        });

  sv.on("/x", []()
        {
          fomatAll();
          sv.send(404, "text/html", "<a href='/u'>Fomat ok</a>"); });

  sv.on("/w", []()
        { 
          int numberOfNetworks = WiFi.scanNetworks();

          String nd = "{`ip`:`"+WiFi.localIP().toString()+"`,";
          nd = nd+"`wifi`:[";
          for (int i = 0; i < numberOfNetworks; i++)
          {
            nd = nd + "{`" + String(WiFi.SSID(i))+"`:`"+String(WiFi.RSSI(i))+"`},";
          }
          nd = nd.substring(0,nd.length() - 1);
          nd = nd + "]}";

          sv.send(200, "application/json", nd); });

  // Tạo form nhận file
  sv.on(
      "/u", HTTP_ANY, []()
      {   
        Serial.println("u");
          sv.send(200, "text/html", 
          "<html>"
            "<head>"
              "<meta charset='UTF-8'>"
              "<title>"
              "Cập nhật html"
              "</title>"
            "</head>"
            "<body>"
              "<br>"
              "<a href='/'>Trang chủ</a>"
              "<br>"
              "<br>"
              "<a href='/update'>Update Firmware</a>"
              "<br>"
              "<br>"
              "<button onclick='if(confirm(`format`)==true)window.location.href=`/x`'>Format</button>"
              "<br>"
              "<br>"
              "<a href='/s'>Cài đặt</a>"
              "<br>"
              "<br>"
              "<form method='POST' action='/u' enctype='multipart/form-data'>"
                "<input type='file' name='chon file' multiple>"
                "<input type='submit' value='Gửi đi'>"
              "</form>"
            "</body>"
          "</html>"
          ); },
      []()
      {
        HTTPUpload &file = sv.upload();
        if (file.status == UPLOAD_FILE_START)
        {
          Serial.println("Ghi file " + file.filename);
          clearFile(file.filename);
        }
        else if (file.status == UPLOAD_FILE_WRITE)
        {
          Serial.println("Dang gui");
          saveFile(file.filename, file.buf, file.currentSize);
        }
        else if (file.status == UPLOAD_FILE_END)
        {
          Serial.println("Gui file song");
        }
      });

  // sv.on("/test", chay);

  sv.onNotFound([]()
                { 
    if(!handleFileRead(sv.uri()))
    sv.send(404, "text/html", "<a href='/'>Loi khong tim thay file </a>"); });

  sv.begin();
}

const int potPinA = A0;
// const int potPinB = A2;

void LayMau()
{
  if (bat == true)
  {
    int A = analogRead(potPinA);

    int B = random(100, 200);

    String s = "";
    JsonDocument doc;
    doc["A"] = A;
    doc["B"] = B;
    serializeJson(doc, s);

    Serial.println(s);
    webSocket.broadcastTXT(s);
  }
}

void setup()
{

  Serial.begin(115200);
  Serial.println();
  startLittleFS();
  startWifi();

  startServer();
  startWebSocket();
}

void loop()
{
  webSocket.loop();
  sv.handleClient();
  nhay(tglm, LayMau);
}