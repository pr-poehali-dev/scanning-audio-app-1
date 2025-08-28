import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Icon from '@/components/ui/icon'

const Index = () => {
  const [activeTab, setActiveTab] = useState('delivery')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [scannedCode, setScannedCode] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)

  // Система озвучки
  const playAudio = (message: string) => {
    // Здесь будет логика воспроизведения аудио из облака
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.lang = 'ru-RU'
    speechSynthesis.speak(utterance)
  }

  const handleScan = () => {
    playAudio('товары со скидкой проверьте вб кошелек')
    setTimeout(() => {
      playAudio('Проверьте товар под камерой')
    }, 2000)
  }

  const handlePhoneSearch = () => {
    if (phoneNumber.length === 4) {
      playAudio(`Поиск клиента с номером ${phoneNumber}`)
    }
  }

  const handleIssueComplete = () => {
    playAudio('оцените наш пункт выдачи в приложении')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://cdn.poehali.dev/files/a41a5456-4d10-41ee-98ae-542d8e0ccc80.png" 
            alt="WB"
            className="w-10 h-10 rounded-lg"
          />
          <span className="text-gray-600">ID 00000001</span>
          <span className="text-gray-600">WN-047</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={16} className="text-gray-500" />
            <span className="text-sm text-gray-500">15</span>
          </div>
          <Icon name="Search" size={20} className="text-gray-500" />
          <Icon name="MessageCircle" size={20} className="text-gray-500" />
          <Button className="bg-green-600 hover:bg-green-700 text-white text-sm">
            Установить версию
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full h-14 bg-white border-b border-gray-200 rounded-none">
          <TabsTrigger 
            value="delivery" 
            className="flex-1 h-full data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
          >
            <div className="flex flex-col items-center gap-1">
              <Icon name="Package" size={20} />
              <span>Выдача</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="acceptance" 
            className="flex-1 h-full data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
          >
            <div className="flex flex-col items-center gap-1">
              <Icon name="PackageCheck" size={20} />
              <span>Приемка</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="return" 
            className="flex-1 h-full data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
          >
            <div className="flex flex-col items-center gap-1">
              <Icon name="RotateCcw" size={20} />
              <span>Возврат</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Delivery Tab Content */}
        <TabsContent value="delivery" className="mt-0 px-4 py-6">
          <div className="max-w-md mx-auto space-y-6">
            {/* QR Scanner Section */}
            <Card className="p-6 text-center">
              <h2 className="text-lg font-medium text-gray-700 mb-6">
                Отсканируйте QR-код клиента или курьера
              </h2>
              
              <div className="mb-6">
                <img 
                  src="https://cdn.poehali.dev/files/aa7ccf4c-678b-4364-bf3f-1566c3c77b5f.png"
                  alt="QR Scanner"
                  className="w-48 h-48 mx-auto object-contain"
                />
              </div>

              <Button 
                onClick={handleScan}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Сканировать QR-код
              </Button>
            </Card>

            {/* Phone Search Section */}
            <div className="text-center">
              <p className="text-gray-500 mb-4">или</p>
              
              <Card className="p-4">
                <h3 className="text-base font-medium text-gray-700 mb-4">
                  Введите номер телефона клиента
                </h3>
                
                <div className="space-y-3">
                  <Input
                    type="tel"
                    placeholder="Последние 4 цифры номера"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={4}
                    className="text-center text-lg"
                  />
                  
                  <Button 
                    onClick={handlePhoneSearch}
                    disabled={phoneNumber.length !== 4}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300"
                  >
                    Найти клиента
                  </Button>
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                На примерке
              </Button>
              <Button 
                onClick={handleIssueComplete}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Выдать
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Acceptance Tab Content */}
        <TabsContent value="acceptance" className="mt-0 px-4 py-6">
          <div className="max-w-md mx-auto space-y-6">
            <Card className="p-6 text-center">
              <h2 className="text-lg font-medium text-gray-700 mb-6">
                Приемка товаров
              </h2>
              
              <div className="mb-6">
                <img 
                  src="https://cdn.poehali.dev/files/aa7ccf4c-678b-4364-bf3f-1566c3c77b5f.png"
                  alt="QR Scanner"
                  className="w-48 h-48 mx-auto object-contain"
                />
              </div>

              <Button 
                onClick={() => playAudio('Товар принят в систему')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Сканировать для приемки
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="text-base font-medium text-gray-700 mb-3">
                Статистика приемки
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Принято сегодня:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ожидает приемки:</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Return Tab Content */}
        <TabsContent value="return" className="mt-0 px-4 py-6">
          <div className="max-w-md mx-auto space-y-6">
            <Card className="p-6 text-center">
              <h2 className="text-lg font-medium text-gray-700 mb-6">
                Обработка возвратов
              </h2>
              
              <div className="mb-6">
                <img 
                  src="https://cdn.poehali.dev/files/aa7ccf4c-678b-4364-bf3f-1566c3c77b5f.png"
                  alt="QR Scanner"
                  className="w-48 h-48 mx-auto object-contain"
                />
              </div>

              <Button 
                onClick={() => playAudio('Возврат оформлен')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Сканировать для возврата
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="text-base font-medium text-gray-700 mb-3">
                Причина возврата
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  Не подошел размер
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Не понравился товар
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Брак/дефект
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Другое
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Index