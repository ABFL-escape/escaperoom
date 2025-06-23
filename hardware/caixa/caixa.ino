#include <Ethernet.h>
#include <PubSubClient.h>

#define MQTT_SERVER "feira-de-jogos.dev.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "escape-room-0"
#define MQTT_TOPIC_REQ "adc20251/escape-room/caixa"

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xE0};
EthernetClient ethClient;
PubSubClient client(ethClient);

#define RELE_1 A0
#define RELE_2 A1
#define LED_VERMELHO A3
#define LED_VERDE A2
#define QUADRO_7 6
#define QUADRO_4 5
#define QUADRO_6 4
#define QUADRO_5 3
#define QUADRO_8 2
#define LED_BUILTIN 13

void abrirCaixa()
{
  Serial.println("Abrindo a caixa...");

  digitalWrite(RELE_1, LOW);
  digitalWrite(RELE_2, LOW);

  digitalWrite(LED_VERMELHO, LOW);
  digitalWrite(LED_VERDE, HIGH);
}

void fecharCaixa()
{
  Serial.println("Fechando a caixa...");

  digitalWrite(RELE_1, HIGH);
  digitalWrite(RELE_2, HIGH);

  digitalWrite(LED_VERMELHO, HIGH);
  delay(500);
  digitalWrite(LED_VERMELHO, LOW);
  delay(500);
  digitalWrite(LED_VERMELHO, HIGH);
  delay(500);
  digitalWrite(LED_VERMELHO, LOW);
  digitalWrite(LED_VERDE, LOW);
}

void erroSenha()
{
  Serial.println("Erro na senha!");

  digitalWrite(LED_VERMELHO, HIGH);
  delay(5000);
  digitalWrite(LED_VERMELHO, LOW);
}

void limparSenha()
{
  Serial.println("Limpando a senha...");

  digitalWrite(QUADRO_4, LOW);
  digitalWrite(QUADRO_5, LOW);
  digitalWrite(QUADRO_6, LOW);
  digitalWrite(QUADRO_7, LOW);
  digitalWrite(QUADRO_8, LOW);
}

void senhaCaixa(byte *payload)
{
  Serial.print("Código da caixa:");

  char digito1 = payload[0];
  Serial.print(digito1);

  char digito2 = payload[1];
  Serial.print(digito2);

  char digito3 = payload[2];
  Serial.println(digito3);

  if (digito1 == '4' || digito2 == '4' || digito3 == '4')
    digitalWrite(QUADRO_4, HIGH);
  if (digito1 == '5' || digito2 == '5' || digito3 == '5')
    digitalWrite(QUADRO_5, HIGH);
  if (digito1 == '6' || digito2 == '6' || digito3 == '6')
    digitalWrite(QUADRO_6, HIGH);
  if (digito1 == '7' || digito2 == '7' || digito3 == '7')
    digitalWrite(QUADRO_7, HIGH);
  if (digito1 == '8' || digito2 == '8' || digito3 == '8')
    digitalWrite(QUADRO_8, HIGH);
}

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Mensagem recebida:");
  Serial.println(topic);

  for (int _ = 0; _ < length; _++)
  {
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);
  }

  if (payload[0] == 'a')
    abrirCaixa();
  else if (payload[0] == 'f')
    fecharCaixa();
  else if (payload[0] == 'e')
    erroSenha();
  else
    senhaCaixa(payload);
}

void setup()
{
  Serial.begin(9600);

  pinMode(RELE_1, OUTPUT);
  pinMode(RELE_2, OUTPUT);
  pinMode(LED_VERMELHO, OUTPUT);
  pinMode(LED_VERDE, OUTPUT);
  pinMode(QUADRO_4, OUTPUT);
  pinMode(QUADRO_5, OUTPUT);
  pinMode(QUADRO_6, OUTPUT);
  pinMode(QUADRO_7, OUTPUT);
  pinMode(QUADRO_8, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  abrirCaixa();
  limparSenha();

  Ethernet.begin(mac);
  while (Ethernet.linkStatus() == LinkOFF)
  {
    Serial.println("Aguardando a conexão Ethernet...");
    delay(500);
  }
  Serial.println("Conectado a Ethernet!");

  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
}

void loop()
{
  if (!client.connected())
  {
    digitalWrite(LED_BUILTIN, LOW);

    if (client.connect(MQTT_CLIENT_ID))
    {
      Serial.println("Conectado ao broker MQTT!");
      digitalWrite(LED_BUILTIN, HIGH);
      client.subscribe(MQTT_TOPIC_REQ, 1);
    }
    else
    {
      Serial.println("Broker MQTT: reconectando em 2s...");
      delay(2000);
    }
  }

  client.loop();
}
