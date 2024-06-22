#include "LittleFS.h"

void ThongBaoLoi()
{
    Serial.println(" ...loi");
}
void ThongBaoOK()
{
    Serial.println(" ...ok");
}
void startLittleFS()
{
    if (!LittleFS.begin())
    {
        Serial.println("Loi LittleFS");
        return;
    }
}

bool clearFile(String filename)
{
    Serial.print("- Clear file: " + filename);

    File f = LittleFS.open(String("/") + filename, "w");
    if (!f)
    {
        f.close();
        ThongBaoLoi();
        return false;
    }

    f.close();
    ThongBaoOK();
    return true;
}

bool saveFile(String filename, const uint8_t *content, uint16_t len)
{
    Serial.print("- Save file: " + filename);

    File f = LittleFS.open(String("/") + filename, "a");
    if (!f)
    {
        f.close();
        ThongBaoLoi();
        return false;
    }

    f.write(content, len);
    f.close();
    ThongBaoOK();
    return true;
}

void writeData(String filename, String s)
{
    Serial.print("- Write file: " + filename);
    File f = LittleFS.open(filename, "w");
    if (!f)
    {
        f.close();
        ThongBaoLoi();
        return;
    }
    f.println(s);
    f.close();
    ThongBaoOK();
}

String getFile(String filename)
{
    Serial.print("- Lay file: " + filename);

    File f = LittleFS.open(String("/") + filename, "r");
    if (!f)
    {
        f.close();
        ThongBaoLoi();
        return " ";
    }
    String ret = f.readString();

    f.close();
    ThongBaoOK();
    return ret;
}

bool fomatAll()
{
    Serial.print("Fomat");
    LittleFS.begin();
    if (!LittleFS.begin())
    {
        ThongBaoLoi();
        return false;
    }

    ThongBaoOK();
    LittleFS.format();
    return true;
}

bool handleFileRead(String path)
{
    Serial.print("handleFileRead: " + path);
    if (path.endsWith("/"))
        path += "Joystick.html";

    if (LittleFS.exists(path))
    {

        String uri = sv.uri();
        String nf = uri.substring(1);
        String lf = getContentType(nf);

        File file = LittleFS.open(path, "r");

        sv.streamFile(file, lf);
        file.close();
        ThongBaoOK();
        return true;
    }
    ThongBaoLoi();
    return false;
}

bool GuiFile(String path)
{
    Serial.print("TruyenFile: " + path );

    if (LittleFS.exists(path))
    {
        String lf = getContentType(path);
        File file = LittleFS.open(path, "r");
        sv.streamFile(file, lf);
        file.close();
        ThongBaoOK();
        return true;
    }
    ThongBaoLoi();
    return false;
}