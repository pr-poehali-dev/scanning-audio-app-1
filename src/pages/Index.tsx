import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'

const Index = () => {
  const [activeTab, setActiveTab] = useState('delivery')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [scannedCode, setScannedCode] = useState('')
  const [audioFiles, setAudioFiles] = useState<{[key: string]: string}>({})
  const [isAudioSetupOpen, setIsAudioSetupOpen] = useState(false)
  const [currentCell, setCurrentCell] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Загрузка настроек из localStorage
  useEffect(() => {
    const savedAudioFiles = localStorage.getItem('wb-audio-files')
    if (savedAudioFiles) {
      try {
        const parsed = JSON.parse(savedAudioFiles)
        setAudioFiles(parsed)
      } catch (error) {
        console.error('Ошибка загрузки аудио настроек:', error)
      }
    }
  }, [])

  // Сохранение настроек в localStorage
  useEffect(() => {
    if (Object.keys(audioFiles).length > 0) {
      localStorage.setItem('wb-audio-files', JSON.stringify(audioFiles))
    }
  }, [audioFiles])

  // Система озвучки - только загруженные файлы
  const playAudio = (audioKey: string) => {
    if (audioFiles[audioKey]) {
      const audio = new Audio(audioFiles[audioKey])
      audio.play().catch((error) => {
        console.error('Ошибка воспроизведения аудио:', error)
      })
    }
  }

  // Озвучка номера ячейки
  const playCellAudio = (cellNumber: number) => {
    const cellKey = `cell_${cellNumber}`
    if (audioFiles[cellKey]) {
      playAudio(cellKey)
    }
  }

  // Загрузка папки с аудиофайлами
  const handleAudioFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newAudioFiles: {[key: string]: string} = {}
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file)
        const fileName = file.name.toLowerCase().replace(/\.(mp3|wav|ogg|m4a)$/, '')
        
        // Автоматическое сопоставление по названию файла
        if (fileName.includes('scan') || fileName.includes('сканирование')) {
          newAudioFiles['scan'] = url
        } else if (fileName.includes('check') || fileName.includes('проверьте')) {
          newAudioFiles['check'] = url
        } else if (fileName.includes('rate') || fileName.includes('оцените')) {
          newAudioFiles['rate'] = url
        } else if (fileName.includes('accept') || fileName.includes('принят')) {
          newAudioFiles['accept'] = url
        } else if (fileName.includes('return') || fileName.includes('возврат')) {
          newAudioFiles['return'] = url
        } else if (fileName.includes('search') || fileName.includes('поиск')) {
          newAudioFiles['search'] = url
        } else if (fileName.match(/^(cell_|ячейка_)?\d+$/)) {
          // Файлы ячеек: cell_1.mp3, ячейка_1.mp3, или просто 1.mp3
          const cellMatch = fileName.match(/(\d+)/)
          if (cellMatch) {
            const cellNumber = parseInt(cellMatch[1])
            if (cellNumber >= 1 && cellNumber <= 482) {
              newAudioFiles[`cell_${cellNumber}`] = url
            }
          }
        } else {
          // Используем название файла как ключ
          newAudioFiles[fileName] = url
        }
      }
    }
    
    setAudioFiles(prev => ({ ...prev, ...newAudioFiles }))
  }

  // Предопределенные аудио-ключи и их описания
  const audioMappings = [
    { key: 'scan', description: 'Сканирование QR-кода + ячейка', message: 'Озвучивает номер ячейки и "товары со скидкой проверьте вб кошелек"' },
    { key: 'check', description: 'Проверка товара', message: 'Проверьте товар под камерой' },
    { key: 'rate', description: 'Оценка сервиса', message: 'оцените наш пункт выдачи в приложении' },
    { key: 'accept', description: 'Приемка товара', message: 'Товар принят в систему' },
    { key: 'return', description: 'Возврат товара', message: 'Возврат оформлен' },
    { key: 'search', description: 'Поиск клиента', message: 'Поиск клиента по номеру' }
  ]

  // Генерация случайного номера ячейки для демонстрации
  const generateRandomCell = () => Math.floor(Math.random() * 482) + 1

  const handleScan = () => {
    // Генерируем случайный номер ячейки
    const cellNumber = generateRandomCell()
    setCurrentCell(cellNumber)
    
    // Сначала озвучиваем номер ячейки
    playCellAudio(cellNumber)
    
    // Через небольшую паузу озвучиваем сообщение о скидках
    setTimeout(() => {
      playAudio('scan')
    }, 1500)
    
    // После сканирования товара со склада - озвучиваем проверку
    setTimeout(() => {
      playAudio('check')
    }, 4000)
  }

  const handlePhoneSearch = () => {
    if (phoneNumber.length === 4) {
      playAudio('search')
      // Генерируем ячейку для найденного клиента
      const cellNumber = generateRandomCell()
      setCurrentCell(cellNumber)
      setTimeout(() => {
        playCellAudio(cellNumber)
      }, 1500)
    }
  }

  const handleIssueComplete = () => {
    playAudio('rate')
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
          <Dialog open={isAudioSetupOpen} onOpenChange={setIsAudioSetupOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Icon name="Volume2" size={16} className="mr-1" />
                Озвучка
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Настройка озвучки</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Загрузите папку с аудиофайлами для озвучки функций
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="audio/*"
                  onChange={handleAudioFolderUpload}
                  className="hidden"
                  webkitdirectory=""
                  directory=""
                />
                
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  variant="outline"
                >
                  <Icon name="FolderOpen" size={16} className="mr-2" />
                  Выбрать папку с аудиофайлами
                </Button>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Загруженные аудиофайлы:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {audioMappings.map((mapping) => (
                      <div key={mapping.key} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{mapping.description}</div>
                          <div className="text-xs text-gray-500">{mapping.message}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={audioFiles[mapping.key] ? 'default' : 'secondary'}>
                            {audioFiles[mapping.key] ? 'Загружено' : 'Нет файла'}
                          </Badge>
                          {audioFiles[mapping.key] && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const audio = new Audio(audioFiles[mapping.key])
                                audio.play()
                              }}
                            >
                              <Icon name="Play" size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  <p><strong>Совет:</strong> Назовите файлы по ключевым словам:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>scan.mp3 - для сканирования</li>
                    <li>check.mp3 - для проверки товара</li>
                    <li>rate.mp3 - для оценки сервиса</li>
                    <li>accept.mp3 - для приемки</li>
                    <li>return.mp3 - для возврата</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
              
              {currentCell && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="text-lg font-bold text-purple-700">Ячейка №{currentCell}</div>
                  <div className="text-sm text-purple-600">Текущий заказ</div>
                </div>
              )}
              
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
                onClick={() => playAudio('accept', 'Товар принят в систему')}
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
                onClick={() => playAudio('return', 'Возврат оформлен')}
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