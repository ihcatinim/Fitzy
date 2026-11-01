import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { signOut, updateProfile } from '../../store/slices/authSlice';
import { theme } from '../../constants/theme';

const ICONS = {
  search: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOESURBVHhe7ZovbNwwFMYLBwcHB8c2cskNuTk0FrvSpLEVFhYWlg0WFk4qmTRycBqahgYPDg4ePFi46XOSKfliX5Jr/jjR+0kGvT7Hvi/2e8/Pd3YmCIIgCIIgCEJgrFT6Jlb6JkrMj6zpxzgxf4v2//ON+RQps+b+i+S1Sp/HycVdlJg/ZTFatkOUmM+xSl/ycxdBpNJrfEnHF+/UsNKwqiA2jzFL8MajRP/mL/r0pveRSjWPNytilZ43rxq9h6+JE3Nbbfpby614y+POglill+x4S+1gfVEL5/tWXbzKtqfeO55jG3wT9wsarJwj4tyv1PsX3KcJpT4+w2rxPlfpG+4TJPA5nm11gHBs3xWkB76tF7xPwlv2OORdn+EZESz3W1WBEv2ILcn2wZCHchJH7/sUpyB7GXWR4sRs2TYI4FfYP9i/e9hWPrIx69utjfMfHUQlnig+Y7u+gd+pj6t/sd3kOBzz4ZRodQrWx7FIA2zrk8kTQprgeGHXuYpGHL+RPPutTBDhmO2GIs+RKisYDpztJoOjCRwn2wxNlOgv/JLYZjI4kmCybDM0K6WvWKCxfGAjHN6nOECulHlXF2i8be4Fb6k+MX3FdkOD3IfnMWQO1pr87MUTu2S7obEl3Po8phcI1CY2wRZzpRrBZNTspFHSYJuhwaplgYJJFpHaVyc3fqqPOjULxDaTYW8baHJjh1hexVPkYl7cqf54jho1IB4fK4rtJiMrYNVyoR3bDYVrBQcTwQpwC8GT7DsfQjKYVSxtAd9GSmd4T/Se+06Ob6J9RhL2M/HGPPA5EA2VTe4bBK4DIyIaTtts25W83s3b2NV2fYw3CK6yq32jPR1e3VVLGiv0mw3XqboQ6alvNqv71H1deQzuEyTIpHnyecP1z8nRxd6ynpuf6/pzs7YxD9wnSI5cyRRt2+WclB+IK6L7RJrNNXReBvWtpOLLICrd21qOSs9twgcxcPDMDp+4anZdRC5DJOC+TOynRZv063pjvvPn9n/zEgnFLD7Qnt7sylPmA559zHHPSiSAEFxL9jo1+6Opa46GixIJZFk3fqvo9y9lUQo/xc8psziRytgtWDjmUmO7JhYtUl+ISC0QkVogIrVARGqBiNQCEakFIlILjok0xWVnkPhEQiV07Lu8YPGK1KFGtXjyetW25IfC+cleSKBI13QQFgRBEARBEARBGJF/25OZu9vs7kIAAAAASUVORK5CYII=',
  location: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARYSURBVHhe7ZohcNwwEEUDCwsLC8tacnaLFBeFWbqZzpQ1sDCwsKww8GBgYWBgYGBgYeHBg4HpfFvXXL7W9upysWXHb2ZBJmv5tCft/pXu6GhmZmZmZmYmkk9m+S4v3M+ssL/zwt3mhbsn22SFu4bPwriT96Z8zWNMjoX58iYz5VlW2D9CQFotK+xdXizPc1O+5XFHjzHfXmWf3S+e9L6GVbcw5Qd+zyjB9sgK95cneRAz9ge/b1TkhVsFkyLD1qlzzfIc+ebB7BXyEPuz4VlsXX530mBL5YW75Mk8mF0jeJptgpyzMPZ72yqs/jeW3IRq46uPMBF7h22BAPJzGjJTWh/cYGxUwlFUuqxwF8KHr7bCIb5lBMFvv+AdCNK+we+F3JSnwoeGXR76g0MuCO+5Ry5j3yTA6qi1yuMPjBXFvofCJ/QgSJrc1juyzrE3h145jPxed8t+g8OJGasJ7QT7PQdSq4KEzn6DEgbIXbOPBLaD10v/J4lWBGpZO0k/xuMAKd/fG4LuaV3m+vbDXmmEoPD+e81zvcHlHeKNfbZ4IRlsiybTCEG0NPxcUq1ITIA0LUho9obHYVhEJrXNtAHKjPsYTt6vkipwy/Om4xC0HDzeLv5safeZDfsMhjpAstJesRzA9hD8WvOa9EwyeYgTLso8+wBuOvE3B2eLlHjb+i05D5XH7DcIkqpln7qPogm0tAZi69IyYfwvxr9XNAFCJWIfPMd+W+ruXT/h0QcIhIdg9op9tvC29RNuLPdpB0hIkFJuEY8qjPvKflDHYfNr1+y3i7Qlk2lcpQ8nfdso1YFfbasqyZryGCsnDA6sOV8BSV+1JfVe0QYIQPQFvp1m112TFdR5qyzolZgAydun3boaV+id4JlnPIuKJiZAAIq6STGTbaQcxfhbEXp/93O9IZXkrgTpm1ZUv+B6x6+wVde2AvU4fJhv11KRGIynlthKI2EMUx53BZYRejBsyTP2G5SnBmhfpMN7rL6kVg8YIkCVJBCSPWQC+w5OQ4BO2e8QIC95PRXkLv/exuIwGFKZ1WiXGOrK5y6kVbNrsTmsN8Q2onAr9othu1qUkqDxHCoJcM0jfbv45tm3C+1qYUO7wmMlhdTVa+/MY1cLG8o9j5kc1XWONMGOG4b6h1Zxq4Vsk8zxahdSRat/+tJcXdg/1roO9JNDPpxvPhwLfUNDAuYzbT9u55VQctRln/uj5gZSOsvZTr7+0aY7kU4B8HeyZb0LscNv0UbVnZnvxyQf6RwpSdUcA/+owVu0NpJOItuujEbDIbSRV+lBW5G85tHyFG0ExOOMMWgeLftqIyDelo5J82jZRxvVgQ3L+ug0j5ZYbSReHI5R82iJ0UaT0zxatNpokppHS5c2mqzm0dKmjSavebQ0aSPpR1OT0jxaGrVRaNPTPFokbcQ2Wc2jRdZGW5uw5tHSpI1ehObRImmjF6N5tFDHru70XxTb08Q5ODMzMzMzMzM98A8svojoPAG9bAAAAABJRU5ErkJggg==',
  voucher: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAM7SURBVHhe7Zqvk9QwFMdPIpFIJA7MtqBCULgmO8MMDiR/AvIc8uTJk0jk/QknTyKRK5HIY163gd2X1zY/vrsZmPeZ+c7N3Sbf9ptN0zb3Li4URVEURVEURVEU5X+jN8PrU4ofL8DbzYn3OzkbM7zorb/urb/vrX84i4z7HI7fm+Fjb90uarOgzrrvnXVfOzO44zRAjPnwqHvjv/CDn0Oddb825t2T52Z4nDs4sdwtefF8VdDgnHXGCHplts9oBvC/l6iz/kdvhqc8ZzHTJRUd6Hxyt3Qe2Bns7njOIjrjX8bm07dAA0drgrA4Jsu6O+7d2+1V+JzWPDoP+kmXGgu5i/yO5N+TF61B8TH8w8a4TzxvNp31N9yYBoYuO962BDpJwX88xsb4txSUZk48OKTtFfebgxb6uL+/5+2ymWbKH1P6HTU4AXkWrcntaNHmXkv01n/jPrkeR+zvGvzE0r+1VOTLZ1klt+z9IwLzqnlW2q8R9SeWAq11c2sF009aW3j/FKQ88AGqMlxhepy4HAeBHXeaYdc1lwQ8D9wwA3pOCXejcCerBZ4HbtgYeB64YWPgeeCGjYHngRs2Bp4HbtgYeB64YWPgeeCGjYHngRs2Bp4HYTh6COLt5uD9uHj7JRB5jqgxpBfD1RfQg71mTlL/BJ9DavKIlBrS+1JKuLDXXNp/zYdTmmeWUsPxPYr3mxHtNdf0X/LhlOaZpcZwZieSab/XLJHWf93nkJo8IrWG9K2OHoJS3tCX+uf4BGrzRMANGwPPAzdsDDwP3LAx8Dxww8bA88ANGwPPAzdsDDwP3LAx8Dxww8bA88ANGwPPAzdMQKpgQ1WIwfNIhlRxwdshSK9gK68Qk/JUDdD4LsQNrb/k7WrJrWArrRATK9RqBoiI/0+e9uacQ1kFW36FmDhDCwb6CBqQ2LSsukJitYINVCEml9i4HW+XTUoFWJWEoiaaHcE7nIdUITYOHPcThKhQW6SsAgyoac9ZHsxS5VeozSJPz/Mp7DmLFWKFqn1kiMioADuJpt3F7L1qQcUVaqssVYCdVn/vnGOJcPT5uhAValkcVoCdUtKec8pe9ZqHoiiKoiiKoiiKovyz/AYuG64dNR/T+gAAAABJRU5ErkJggg==',
  bag: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMhSURBVHhe7ZsvkBMxGMVPIpHIkzgw3RRDLqdwm3SGmSpAIpEIBA55shLcyZOVyMqTSGRlJbLMl+aY9iXLlTZvL1vym/lm7s+3eS/ZJJvdSc7OKpVKpVKpVCq90+jWNsZ9bYz7roxb74ZdNMZeK+2mWr99hNeeNNIwythl3CidsRpp+x7LOTme6faxMnaeaIA9wy5e6MlTLPckkIo1xv2MK/3PsWq0G2P5g0YaRyqWqKyPxtgfzaX7ooz7vBW3mLeV/0vp9gJ1BolMsDI0sJKbsIuRbp/jNXco3Z4r42bxdf7a5Ui/foLXDA5lJldx5dy60e0HzO1CekuqB8rTD3MHhfQOrFRoHIu59xHKihvpgLKKQRl3gxWS+QXz9mWzPIjKu8W8QRDmj+yVSTX6SLtXmFc8srDDiuQYDh3DdoZ5xZO406tcrwz4aiLrK8wpnsSi8AZzDiWsk3Z6UfGPfP8o3o54GHyLcg4O+wnLH790b7Zz0F/vhLlAFnGdK96HDr9CN/Y6x9y3NzKPhNeCyFDZYef0Ybh5bdizx1wk/pYzLid/fh7j/zrCz4u6Pcd6ZaP7vWhIYRdYryzIJ4ZYLNwVaTjdvosn04cKN5V3QJmD0K8E5eObfBpFIWmYXGsbFkrbjwnfR6/oI3BdI7+X3jh3JBata/m6iXkHs/lUindhcoV5peKHP/rPuVby4xoEel1bHEnKP72BsgqQofunC5Ch+6cLkKH7pwuQofunC5Ch+6cLkKH7pwuQofunC5Ch+6cLkKH7pwuQofunC5Ch+6cLkKH7pwuQofunC5Ch+6cLkKH7pwuQofunC5Ch+6cLkKH7pwuQofunC5Ch+6cLkKH7pwuQofunC5Ch+6cLkKH7TwkMaWdpyn/WBgpnLXYFjtjv3DfJ/dU5G0iId7nbOeaUSnJHXO6NVMlzXtpNMa80ZC+lPx20e3OXmHc0qY3hIWYyH/lxXlhIz4kbR4K0M6X7WNOQwi6z7g3aJt1dhxX0bTuyV7Fr71/hseptzgzbgeU4QHR+q7QIPX5GG1b34Y89JSbIEuJvxz0rlUqlUqn89/wGq5LyBuH2M20AAAAASUVORK5CYII=',
  card: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKDSURBVHhe7Zohc9wwEIUDCwsLA8taYutKslFRQKeWbqYzh9rCwsLAsMLCg4WBhfkJhYGFgYGBge2s4874Vk4txeuTdfO+mTcBWT/7bSSdc9LREQAAAAAAAAAAAADoY6g5XbLk885ORc1rY/3WWH9trP9TgmrrftfWXdbUOJlHDaJPz+q3/pu8eXlyVxV9eCHzTYKbU9KIGVNt/Y2h5ljmfDLdlApuVLbcL5nzSdTkV6F591fgxlHzWS6My5HfGLv+zmuQfH5WRe6LzJtMbf0PacyN4Wkna5eMIXc+kONa1iXTjZSdkVNac/5hrP8pm/SKmueyLhq+WBrykJV1pdAuBzLPlHeldh4Lw1nfJWZmKM8cDfoaLoZlqH32uRt0UDqd2KCK3LvA9NB04tYydzSG3m8CwwPT6sR/lLmjOfQptuKfU6bYUIOwSPdojTUNM6OeR90wM+p51A0zo55H3TAz6nnUDTOjnkfdMDPqedQNM6OeR90wM+p51A0zo55H3TAz6nlSDNvaCMnr9klKnihiDPlrzNq6+6DufyJ33vfYFzF5khgz5O+sk5vzsBV8r767GcFYnmTGDHl3Mvh9pN7Q+uXu3eZnLE8yMYaP7JuNyF31PfZFTJ4kYg15NLS1EeLTIfL6fRGbJ5ohw4r8mawrhaE8kxrUjgxpaP2FrCsF3tML8kxpEGOsv9s1zbN+aDB4vmnqMRhuSGjqN7Ju6fDaF76SuFtZlwwfEQka9KAtr0dyEV6ieOSEzWEpnTPgw0aheelyt5NOdvQZHp5lS/0QBp80e+ykVmG6m20N7Q5zXoSfbMtXNwO2atNqjPb/sIEFcYnK+fYOAAAAAAAAAAAAsDD+Ap2wCDKEIUTHAAAAAElFTkSuQmCC',
  userBadge: 'data:image/png;base64,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',
  bell: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANISURBVHhe7ZsrcBsxEIYDCwsLC8ta4rsWyQoqOykznQlrYGBhYFhgoGFhoaFhYWBgYeFBQ8N09h4z8a89P+rT67zfzIIk65N0Xu3+euTiQhAEQRAEQRAEQTgblPr+plT2utDmV6Ht71LbdantS2/t78xqpsztR1W9xc9PlkLZz4W2PwttNq9fyAG2nCn7FZ83GWbq2zuKFmbgR5pZlap6j8/PGppKOIVOMYq+QlU/sJ0sKVV1gwN0Btvkm6vHUtv73ri8xNgC28uKbrA4qN6e6eXtS8Bt9JkV8/nGKJ/hZ7JgR+Ss/2d6UIIutP3LPO+Fog/9k+aLuvrAValmgCckWIq2buo5LymbCtfoG22ecAA0paiSof+xdM9nppypx3i+d7qKBZFjNqdEDkIvqdDmD7aTxVRrki92XFU36HcqreDcnsb0c9JRVKjKOC9H2yX6jUWpzJ3bXsJRxOWemao+od9YdPmohjbX9Hv0jQ5VGHw5PqOnhySD066q5ugXHU73hCi9lPyx3eLSPqBfdEjRbnVSm02oUGcKwzP6RAfLLgk69PFFt47biiL0iY6bLMNVE256j6m7RsHpoLb36OMLynXYvs/qeTRcovQhDocg0YjthygQB8OV2pAdJPWM7Se1V8RUkeBijRGpwfvAQnM9hW+PTj+cfih7jX7B4Uos5QT08027V4R7UGaFfkHh1kKkh9AvFNypSdTVPbt6V+YO/ULBlfuY/aHkvMQORf3GGMEaLaK7g8C05jxF9aV9wC8tRk5ktU8KVYMODJx+RaiqSWifIaJrolS0zxDRNVEq2meIqJooNe0zRDRNxGmfZjdRVfOkjLsXEEITcdonFwsS6e7czsu8bqQNHO1kZd6LCZVzbDQfM084Hi84CTETCyoWBU+0WxKko0x9yE2z/mZZe3PD3OLfJ8fri5ntoIerSlsUtkVpELEXi4HTh8HzM06UUi5Bv0nhXu0dXiNxezvJnZiODXu/kFlp09RzRamp0W9ysFsRrS2aBK6qOUWO+3LIwp33R4XZ0DrATL3v0vlk4KfPbqOEjc+ZNN0tVeYqr2NrLkedBe3mW7Nv4/zTShdhi7OZVvtortB0a6Zd4lEQBEEQBEEQkuAfPl9K5wTsAgMAAAAASUVORK5CYII=',
  globe: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAWwSURBVHhe7Vs7jBxFEL2QkNChI0SGk+05JHQ9vSSOPN0rITkCAgIyLiAgdGYiLkGyREJoCYILL8SIwOGFFgE6JEusCKwLLSwjo5rpWc+8qt7dme65vT36SSXZM3X9rXpV1T17cJCRkZGRkZGRkZGRsSf4UC/eV7o6Lox7pIx9poz9uzD238K4N60oY1+o0v2u5tVPhXEPlHaH2M6NAk2wMIsTWpDuQgwTu1TG/ah0ZbX+7B3sYy8x0+5uYdx5b6JznPhmOWTP7JKsEPvbG8x0dUcZ9wtONEb4ItWu+IwsCvu/tiDTJzfAidSy1nLsczV3vxXGPVHGXajSvuY68iKR0GbM9Ce3cDzXCoWubjN32ij2qUTATVv2jOuHF5oWliwX27oWaEjYLnHQnYX4R3h2tolsg9YYEGXsy0K7+9jOTkEcUA9MGDBZlDLuCT4nl9i0OC2UsY/539sLVbpf8flKtP0G29kJyHJCi6Pm7iGZPHte73J1G9sKwfPaBWtHV8frNmfnUc7zBHMrvwCf1zrGneL7mbZfYlubUOiqxHaob1o8HzHZAjZ9ubvY1pWABhYg5MuWdCmqCO/Psa1tQZk3tteG+A909W5oPJS5Y1uTI8ALL7sRiTJnphORs0ju2l1wWiTJkujZtnyXBIGBvsHoQbvX17HL7vsxkFy2ayH0b97vFfORZMpEyD0diTMSRJYmnVjfri9v+jqer7p6k4BchHfOeYUWDPVScQEGBkoZuA53b1zISSBZjxQpsGqn/6POWGDySNxH/NPV8QGi52qkN2k5IpuuO+V6PHqhC8aAuI61L5C/P3Pqj3dKK5LCrFT7SAspWdlY+JC+ceI+FcFA8RT1kkEIoYx7CNLOoQvEgvOQfYw6BHRHkkncTIwexj1APQK3tPjwjhAqfXGzJHdss/ykoMXAjqRjCgKZMSzQGerEAqMUETDqEJo6jtVqjDejwTPnsFVwV1ycoE4sqJ6DSZNliAUwWlvKiLoCPz4NWwUnRtkVYxBwHXGBMCcLWVsU0CoU7Qply5LAwNWR+4HpRIoUCGa6+gL1SGZH9jvUTR00DlRZvcJO9lbKdFl9jdnH9j3Wyb7LkV3gPEej0PYj1sGey+GR+xTnGQXsYJ+Fro6kCiAKmLkWpf0ZyXAlOChdfc90ImUISR/qe99y3cTZtFDFB5MtHMwUYV6q90JhXkpyUScamGyFUnsCSwkSVvItqFzASYcWCOsxGh/qRIPXV2EzxbOgddY2FlS943hQpwWjhykqevEkMVD04bnxFKk9lj6hPoYU2VGQiz653MDUniT1efC2nCjxT/II1gJ5iBZMmrhUJ6UclD8I67Uf4jl090n4p4VIjEKlLl0Lpbx2Ed1G+GBBpAXjHqFeMhApo5tJB+HSUad08zAWkttgBAvd/Ka0ZBESv0jHnTy0yu44BjhxiaClRDLEU0nR7AyGTX66KPGQ5AZD4T/Sgon33bw51OdjnNx6Wsi7Y5ddMx8S9YYg4F5l+95/KsO+jZSsfFKgmXs577oR5iokMbsoW2//SllKaCWenByhjwS6n9XVxSJ7Pz6KSJbbjY5Sdl1LAtceBbFgbOS83TG0tGY3h1tRc1vL7sJWliFZTq0TyI+uDNKuNoNvvjiVc6e+K24DyV2JnP03QYxzvEwftbYBhvRW/AdVX6vS/onvhtRDUkSsA0Bpv0Kr6sjgTZgUeJHXm0xZvcBntQSK3S7IjXk0rA/s/mLP3spp8luLFKDLPHEyJIGPv4lYQztNCxhsLyA755xN8JFLiG7rxF7S3VlzZHrvfn2PVdo/uF5Y6oXcVbQaipo45+7h0N2PkFOsxfYCTWgOc1OsND9gGZ4yXDs09RP9mK5zVj1fsAlvKZd11OyUFzcK7c8x1+QuK3n70yf6nGZxggXx/wZkYXTT6X97cUxkfSNcJyMjIyMjIyMj4+biP5MxUN6cAitoAAAAAElFTkSuQmCC',
  moon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPQSURBVHhe7ZshcNtAEEUDCwsLC8taYqlFlysq011mOhPWwsLCQLPCwMLAwMBAQ0PDwEJDw8J0vnRqpX97kh2nE2lzb2ZBkh3Hu97d292TT04ymUwmk8lkMpnMzDDmy4vS+PPS+mVh/aq0fldaf9+Vwrq78Lef0H1rqpf8OupYGP+psP5Kcsg+UjvMVF/5dWdPaarT0voNG/xwcdvSuIvZR1Vpqtel9TexgY8lcJQ/5/87CwpTfS+s+x0b1Zem1rg7/v1h4m5nFU11YY2M6BuEWgKj9nXkmBTW/0LE8nuZFPXpBOMFAxpx68L4960+TrFYp290KOrQWxbWXY/Ust3CVO/672oiIBrSbz6uFQvjvsV6rWPcddeRTGEqN3ASblh/EqSLsVtzfQg9kKS7RSvQ1U2xMJ9f4bXj1/D3k0s11JHoTYZIQNp1dRvDxE9/w47cB05TpCXrPCmhx2Fj70t7dsm6QKpRMAqOY919Qd1pHHV2+RAn/zdCmG/ZYKQb6wKcXILubnIp8VjgE2OD0dNIn2I44WJnahwdAKKH+xf8/MGcvWFdIEePu2U9NUjRk6o7QGoBJtuzHEvdAQvRkyq0iUIu1ikVyH3MUPTE0YZmj/XUENp/Shc5eoCQXtPsdh8LbvSwyGKdljCCULT5JeupQawnxl2wXkuYm0i/OmU9NXBrD0kd7YDrD4o5jx+q4PozNvvEQ6xbs44qwk1D10HJ+gOEiVvv8Q7qzV3fQVes04X1sW1kHVVEDeJH/4N1upBzIHpPsGbg7BuMzSDrtUj6aofTFjYYyzLW6cL6Qw5VAafYWMqwg8b0Z8+hRZe7bvUO4rnq0FNsrKjPHu6DxgbPuA9SvCQD0qghrVhbhFvWHeuoQhpWh3Y74pWQ1iU9QG8Tn2TpZRkuAmMHzfSJjH2J65DbpiZ0aT37LOvQUIfME/3Q/loF4Saz76CB00zaYY914LOHoyIYLRbrMJNRw5hOSxVIUYSmMHXk82bx+UaRddesB1I3sc+xFiULthhF1q9Upxpmq9hoREZ8rSxFUSPpPmr2hKc2eO8M2UmP0YmdtfZ6FJ6H5rVGHUnSyRYexoychLlNbbrBEXL6NCuO7ukWjn2+jm5lIzlVBUgpKZIacduu4Yi6kQfI4cBl3WRquonFLSsvychRa+ylEVHh3j5qFQYEzr+ZvcPCk6ypFPoroRZhrhvVZVHRP+GhhnTKHSlaViYhmg5Jo1GpDwNtSzfUjWO+TPfPOX4l9Vdq6Hwd8ybVFrDAKSjsKurOQ6hnOuy6SVKbgUwmk8lkMplM5sn4A9ubQULMXgsAAAAAAElFTkSuQmCC',
  chart: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFJSURBVHhe7ddBSgNBEIXhHMGlS5fudJMMrjpzgp4R3HsMb+MxPJrLSBZGaJAWf2pekX4fBIKZH6rK1ex2ZmZmZmZmZv80lfp6mJfPaV5PU1ne2t+H9lDqzeU483o6f9+Xl9v2uWFNpR6/j3P5lHpsnxuWD9ThA3X4QB0+UIcP1OEDdfhAHT5QxxAHIu9SV38g+i519QeiC9I+Pbog7dOjC9I+Pbog7dOjC9I+Pbog7dOjC9I+Pbog7dOjC9I+Pbog7dOjC9I+Pbog7TehfBunfTj12zjtw9EB1X04OqC6D0cHVPfh6IDqPhwdUN2HowOq+3B0QHUfjg6o7sPRAdV9ODqgug9HB1T34eiA6j4cHVDdh6MDqvtwU6l37YBP5fm+fe436n4Th3l9/xlw+Wh/71H3mzj/1/alPrZ//yt1b2ZmZmZmZmY2gC9UME+Biw7NyQAAAABJRU5ErkJggg==',
  chat: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKtSURBVHhe7ZohcBQxFIYrkUgkEkfNJUWFVOE26QwzdSCRSGQdEnkSWVl5shJZiaysPFkJ83ZzQ/dPbim9/ffC7ftmnrnJ3v/v2+QlO/uOjhRFURRFURRFUerFuuZtTYH+JmfhmmPr49L6eGN9/FVjGB9+Gh8ujWsC+qfh3Idn5jR+RTP1R1gt3PsXeD+jIsmpecb8LYyPt9Y1L/G+RiMtqUz4/4rwA+9rFIyLJ7lYeiqSONd8xEK5v4jn1p99kxqEfiUWLnzC+9sZ4+N3FJLEyLLDsTVhXfhS8H2D43YmzZTezKk9ORusj1eYpNeueY7jnoz8GQrIFMZxtdIuf/Q/5lmpXdcgMOnZYkdK/ukJGlWADN0/XYAM3T9dgAzdP12ADN0/XYAM3T9dgAzdP12ADN0/XYAM3T9dgAzdP12ADN0/XYAM3T9dgAzdP12ADN0/XYAM3T9dgAzdP12ADN0/XYAM3T9dgAzdP12ADN0/XYAM3X9JYOHiOxxXKyX/oybojTt7lQn4eIHjakW+wGT+x0yQYH1c90XCCsfUSrEbZewmBklILhLPcVxtSB+T8eEeHu4djtsZ+eCfJaiLpdSjx37KbevBRCEzJ0+OBOmrsLSO5GJdiJGhrgnjms/y5PC66SPcPfZh/jPl6doPGfPwmrYjrdwZspegfzKXPqFtfTdtPNgduqaH7bNu4lhPVjNTK95FvrP92R262dZvmdlHpBm/pC2rIQp9N2v5PZ078uR1fUXXWExZgct9cvKiG1ZdMc4Tk2KJ/3GwSEstJmCogA/tcAdJ8fhejrVMd7z+4ElFGpPRC9nt5D0Or50FhQINyYnXe9k5aiEv0L2YTzEuUSrQm5hdMS6RDoqYnHkW423IG/EmObMuxkO0rxMunuDviqIoiqIoiqIoyiC/AVN/5KRIi0mjAAAAAElFTkSuQmCC',
  shield: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANaSURBVHhe7ZotkNQwFMdPIpFIJA7MNqBCUOea7AwzOE4iTyJxyJUnkciTK5HIkyuRyJUnl3lJCrv/pk1Dm37svt/MM7dv2+z/Xt5H2qsrhmEYhmEYhmEYhjk3hCzfztlwvaMhZHlTKP0olDnM3qT+jOvPyktZPl2MOMocaK0r+f4Z/o5svJHrF7iI2duY203I8nltAXO3qQUqZHmLCXIqs2uZm0CjLiCCFWrK9bFAEVigCCxQBBYoAgsUYSqBhDQfCqV3hTK/VlJ/ws8rLlIgmv2O79c2PlycQCtprmv3U+ZAIw/6EhclEInTMBg/oG/FxQi0kuUrocwe70U5iNaA/hUXIZC/R00c+lvT1qo4e4Ho+jZK8B7K7Cmq0B9ZnEA+j+yE0r+FMl/w82P8YdwOr++qlrlG/xCLEwijoVDmG/oQUn58Qsm3dm13nKLRv4lFCUQ/OlSFUCQnjt6in7/2zbFvjEUJRAi13tT8QSShzD1+7q6bfuC+OIHaooNEIsO/28/ema94rS4sTiCiTaSQ4RZMYa4CRfNEgkj3+N0UJheIqC+gW66Ii6S35IPfSyE0uxXSvEa/rPie5mgR6w36NNEi0gP1QeifCk7+1lpGkyxgv1Io/R192kCRCmV+DCEOEXrs0zcqkwlEQON03Qblhi7jQwpCmTv45z2iT3ZCvU3TAdbYYOculP6JPtlpqBTRSpabhvcGWue/LIRGiD69y1BQNUWBRq9gFZRYTwVqPiceA5/4obqaPfqNRqhapJT7oQmtZ9Kopmipb7Npoqgheg5DV8hkQtWMyiz65SaUe/qOLIMQiiIbSQkHXH2hJBxaw+TRU0FlFBdnD9xHaO/dES32PemdfXaworlFtj+e6QuJE+jo7X2HGlsGg7ZaKEm65+jDh7oTp35+TVttsr4nRrC7drYfMie5nFPfVlYgWd6i/6ygty5w0f9Mb2MP/drwUXMyiJ6IM2XPk0KHt/DvUk74/HxFhSD0pLWy8eetPrS8dPDX3DZZb+wBlz/2sMe57lVeTT869BARbfbbqgn/8kEtkQ5lJF7Xp62zxuWleoXrYXvqnEc/JcyJTbBuHPjviKItSc/Kppj1RqVKul3yi4+8pKR+dtgmk3qoI+vTDjAMwzAMwzBMdv4A5aFFzPTCmAwAAAAASUVORK5CYII=',
  doc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJVSURBVHhe7ZoxTsNAEEUpKSkpKamAJnZAIRs3FAhp10G0QMEBKLkNLTdIQ0nDGTgIZdCuACXjdWYseXammCf9xnY8Tx8wu3L29gzDMAzDMAzDMPRRO78oGThfLbXzj1UTvuumXRePa9+hjypOnT8QK+c3VdO+QS81pF/3jHTpVE37Ct1UoKWgGJUl5QqqnH+GD9Sxku6dKUdtSUkcijL+h8nO01xSVli4IFUlZYULF1Qt/Cc8pqaknHDxgi7DVd2EFTyuoqSccOmC4jHnHvZVltQnDK8bi13zVJa0S5iD3LzNZUX8c1P1TMoJly5oSCoXPuA9WckKMxY0ceGmM29Qwrqe3Z7A+7JRuqDahVln3sBM5+09vC8bpQuKVE371ZlJzLSA3xYSBUUu5svrifNPfw/nvmT3bgX8/pEqiIq4n7gAgrifuACCuJ+4AIK43xCBdC1j4LxIOkf0Y4EiUPSthwsvYDbqxwomUPqtR5w1cXeHVD92MIHa+aPOeeacu+Ux1Y8dikDcRXeuYUtYbc6m+LFCFYg/1XQtYybOn8G56RzBjw1xAQRxP3EBBHE/cQEEcT9xAQRxvyEC6doRAu+7i/QZoh8LFAGWlTRYMfdB8WMFE+BaScMVcx+YHzuYAOdKenPF3Afmxw5FgGclvb1i7oPixwpVYMyVdG7F3Ef6DMGPDXEBBHE/cQEEcT9xAQRxP3EBBHE/cQEEcT9xAQRxv5wA59eAh0bnq2ftsYKQFC6Iba/FFcoeblR49lpcoe3hRmfMvRZXhuzhDMMwDMMwDMMwCvEDUZwBFtoRqEAAAAAASUVORK5CYII=',
  info: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARdSURBVHhe7ZstcNswFMcLBwcHB8c2EntDqovGLOVud2MbHCwsLCsMLCwcDCwsDAwsHAwMLOzuSXJT//Wc2NFTnPT0u3t3vfTZlp+e3oeinJ1lMplMJpPJZDKZE+Gbmn4qVH1ZVua2qMyDE/1UVuZ5I3rhP/9bVua6UOYr3udNQS9YVtNZUenHtiGGiF4VlbkrVK2V+vUOn3GSTJT5XlZmGb5srOgVeSE+72SYqPoLLZHwxWSFPJI8Cp9/tJDr0zLAF+mQtTOivqc4AzL38ekfc10gpDtRPz7geI6KUtUfdy0n98LTWanqc7y+CwrqpdJXfe5NnovXHwUuCOsVDvrV4B8kBk9ess1DbTZU5ideNyoUA8I0/SJLCtR4TSw7Y5zSV3jNKJDndBmnuDA3qC/NtskZPcu5mBMuK+fm9W/UT4X3JjaYp/DeXlC26gia6zGq3s+qft81HgryqJ8c3wIEnjOGcRrISJwn0WcHrbzJpXEQVo4ge9iSoDJrHNtB4xHnyocIyH3x7Q1MoF4dxIsoa4QPN0vUGwoF9aazl0jRthjFcQrcdyec98RmCjIO3pPaDdQbAhWUuNQoRiZtR3jXNXPUGwpndHo51BuK33Nq3zelF9EGFz5Qon3gM49+Qr2h+FIEArZeoJ4YzItExx6CixdURqDePnB9W5Jl5prR9oNi40RDuEWi76mmQb19oNIjGHeKKt/v0bRnecSisC/O+EGvFh03A8LKWa9Q51jxG3Kbia30I+pEE24t6HvUOVaoiAUDRSeAAAzQFDNQJwZXKPqlIJyKJ0r/aU+ueZaKcS8w61gkQBOuydzcX7qg46p/0Q7fV6WtB9CsoN6+0P403n/InvUu2AwseP9mMx4fIJYqUxuI3X0QvL8lfIBcnEhvoLBFkugAWoRbq9MZ6uxLagNxzbBkjLMwDaVYsZXcQEyRizrRYLEl1YcRqQ2E/RiVLKgTDd/Jy7hpagOF4SFBR8/VElKZLKWB2BQvWMO9wDd9Mu1GSgNx8Uc8gzVgHCKDSWyEpzQQHthKEn8auHQpke5TGYgNC5W5RT0x3MmK9jKT6JtSGKjrm99ky6sBtw68kaK2R1MYiN2wF6zdOnEzg2kzbneR6/Vium33PX04xuTe08DPjl7Ri6JuX3BPGv/fF7+/HZwbivXywXDrmz6LyWrkNbGzzBW0EnFyMF2HBGj2Y4wUgz/HiJM23qEKbhvBy/LQM8Z5Dsnohyr4eOQKstjl0gd/JiiIOV7SZ60+YLe8MRIdqKovUy05V7iG2cpLVDwUh/v6eCM2w4k0toSvkLkk0chc/FsLCWgjHyvt17LPIfKG3ofJx445u/BVMZPdAqGfIdDSvLYeoepzu7lORaP92yaAa/cLoeDQRCB2YsbKVkOxgfPC3GzzJmGZxxSpo+G+T9sWm+JE6ucNo+N6rX5LpYe4pblHHDsJmp9jbqldGNELa+CIhvikaQLza3kTSyeTyWQymUwm83b5D2B+9RkWJBfsAAAAAElFTkSuQmCC',
  logout: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJ2SURBVHhe7Zoxb9RAEIVTUlLS+Yp741MqSoQoKFFEkZKSgpKCkpKOkj+AlJKSkjIFPyLJeR03CMqUkRASaKwromdHznmdnbWZT3o6yTfnmX06j727PjhwHMdxHMdxHMdxnKVSleXzGPH5FkMAPgeRv6pq9zlWW5H3fP5Zc7laFTzIGFUi183h4SPOM1vCZvOKBxmrc5EN55kt2jt4gFECvnGOWdNn0FbkHTfgu+gCeMznnz19BukxjvtvcYMGcIMGcIMGcIMGsDAoAK8DcFaJXOkdk7/PitQGNUXxoAJ+3cyX9fQktUGK/nM6OUVecFwWGBn0pZNT5KopyxXHmmNhUFMUDwPQcF7tS3oJcrwpFgYpOi3RmT/nDsBXjjXFyiAlAL0rCVk1bUuDlBr4xPnbGnJp2tYGKUHktFNDLk07xiCNm0L1ev0y0LNRqxyathbIhekxjruJPgn3NtgJVe9UAT85f1L2NUhv0fdtDutHWT7lOpKxt0FlueL4qXTbjkoNvOU6krGvQUotcsK/mUJ6SfGxAPzh/EkZY5CiOxfcbKMEfO/UAfw23yHR4jqF3cGgKamAD1xDW4fIMccmx9ogNYHztwI+cqwJlga1l2nP0kdWe2tWBu1m9GecW2f5+h3Hm2FlkM7aO3lFrs2bMmNhUNZNmbEw6JbFsjyaMpPaoHbRnqcqOTVlJrVBCq0BnWbVlBkLgxRtxtv1+gkfzw4rg2aDGzSAGzSAGzRAn0FjX8Hjcy+CPoNilNWe1hS0Owo9Ax2rxb0nXYs840HGKrsJZyy1SMWDHK2cpw0xXABHlcgbbrz7aJHvSTuO4ziO4ziO4zjOffAPLwKIo3S4LK4AAAAASUVORK5CYII=',
};

function getInitials(name) {
  if (!name) return 'FZ';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts.length > 1 ? parts[parts.length - 2][0] : parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

function SectionGroup({ title, children }) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      <View style={styles.cardGroup}>{children}</View>
    </View>
  );
}

function SettingsItem({
  icon,
  title,
  subtitle,
  value,
  valueBadge,
  showChevron = true,
  isSwitch = false,
  switchValue,
  onSwitchChange,
  onPress,
  isLast = false,
}) {
  const content = (
    <View style={[styles.itemRow, !isLast && styles.itemBorder]}>
      <View style={styles.itemIconContainer}>
        <Image source={{ uri: icon }} style={styles.itemIcon} resizeMode="contain" />
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle ? <Text style={styles.itemSubtitle}>{subtitle}</Text> : null}
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#e4e1da', true: '#181818' }}
          thumbColor="#ffffff"
        />
      ) : (
        <View style={styles.itemRightContainer}>
          {valueBadge ? (
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>{valueBadge}</Text>
            </View>
          ) : value ? (
            <Text style={styles.itemValueText}>{value}</Text>
          ) : null}
          {showChevron ? <Text style={styles.chevronText}>›</Text> : null}
        </View>
      )}
    </View>
  );

  if (isSwitch) {
    return <View>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && { backgroundColor: '#faf8f5' }]}
    >
      {content}
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const busy = useSelector(state => state.auth.status === 'loading');
  const error = useSelector(state => state.auth.error);
  const orders = useSelector(state => state.orders.items || []);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Switches
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [smartSize, setSmartSize] = useState(true);

  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
  }, [user?._id, user?.name, user?.phone]);

  const activeOrdersCount = orders.filter(
    o => o && !['completed', 'cancelled', 'delivered'].includes(o.status)
  ).length;

  const addressCount = user?.addresses?.length || 0;
  const voucherCount = user?.vouchers?.length || 0;
  const paymentMethodLabel = user?.paymentMethod?.last4
    ? `•• ${user.paymentMethod.last4}`
    : user?.paymentMethods?.length
    ? `${user.paymentMethods.length} thẻ liên kết`
    : 'Chưa liên kết';

  const showUpcomingFeature = featureName => {
    Alert.alert(
      'Tính năng đang hoàn thiện',
      `${featureName} đang được phát triển và sẽ sớm ra mắt trong bản cập nhật tới.`,
      [{ text: 'Đã hiểu' }]
    );
  };

  const save = async () => {
    if (!name.trim()) {
      return Alert.alert('Lỗi', 'Họ tên không được để trống.');
    }
    const result = await dispatch(updateProfile({ name: name.trim(), phone: phone.trim() }));
    if (updateProfile.fulfilled.match(result)) {
      setEditModalVisible(false);
      Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật.');
    }
  };

  const logout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản FITZY?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(signOut()).unwrap();
            } catch (logoutError) {
              Alert.alert('Chưa thể đăng xuất', logoutError || 'Vui lòng thử lại.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.paper} />

      {/* Top Header */}
      <View style={styles.headerBar}>
        <Pressable
          hitSlop={12}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home'))}
          style={styles.headerActionBtn}
        >
          <Text style={styles.headerBackArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>CÀI ĐẶT FITZY</Text>
        <Pressable
          hitSlop={12}
          onPress={() => navigation.navigate('Catalog')}
          style={styles.headerActionBtn}
        >
          <Image source={{ uri: ICONS.search }} style={styles.headerSearchIcon} resizeMode="contain" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        {user ? (
          <Pressable
            onPress={() => setEditModalVisible(true)}
            style={({ pressed }) => [styles.userCard, pressed && { opacity: 0.9 }]}
          >
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
              </View>
              <View style={styles.avatarBadgeOuter}>
                <View style={styles.avatarBadgeInner} />
              </View>
            </View>

            <View style={styles.userInfoWrapper}>
              <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
              {/* Badge hạng hội viên: Tự động ẩn khi DB chưa có trường tier/membership */}
              {user?.tier ? (
                <View style={styles.vipPill}>
                  <Text style={styles.vipPillText}>✦ {user.tier.toUpperCase()}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.chevronText}>›</Text>
          </Pressable>
        ) : (
          <View style={styles.userCard}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>FZ</Text>
              </View>
            </View>
            <View style={styles.userInfoWrapper}>
              <Text style={styles.userName}>Chào bạn</Text>
              <Text style={styles.userEmail}>Đăng nhập để nhận đặc quyền VIP & đồng bộ</Text>
              <Pressable
                onPress={() => navigation.navigate('Auth')}
                style={styles.guestLoginBtn}
              >
                <Text style={styles.guestLoginText}>ĐĂNG NHẬP / ĐĂNG KÝ</Text>
              </Pressable>
            </View>
          </View>
        )}


        <View style={styles.vipBanner}>
          <View style={styles.vipBannerTop}>
            <Text style={styles.vipBannerTag}>ĐẶC QUYỀN HỘI VIÊN • SẮP RA MẮT</Text>
            <View style={styles.vipCodeBadge}>
              <Text style={styles.vipCodeText}>SẮP RA MẮT</Text>
            </View>
          </View>
          <Text style={styles.vipBannerTitle}>Gói Hội Viên & Quyền Lợi VIP</Text>
          <Text style={styles.vipBannerDesc}>
            Chương trình tích lũy điểm phong cách và gói thành viên độc quyền đang được phát triển. Sẽ sớm ra mắt trong bản cập nhật tới.
          </Text>
          <Pressable
            onPress={() =>
              Alert.alert(
                'Tính năng đang hoàn thiện',
                'Hệ thống phân hạng hội viên (Tier) và các gói ưu đãi VIP độc quyền đang được xây dựng và sẽ sớm ra mắt.',
                [{ text: 'Đã hiểu' }]
              )
            }
            style={styles.vipBannerBtn}
          >
            <Text style={styles.vipBannerBtnText}>THÔNG TIN HỘI VIÊN (SẮP RA MẮT)</Text>
          </Pressable>
        </View>


        <SectionGroup title="QUẢN LÝ MUA SẮM & CÁ NHÂN">
          <SettingsItem
            icon={ICONS.location}
            title="Địa chỉ nhận hàng"
            value={`${addressCount} địa chỉ`}
            onPress={() => showUpcomingFeature('Địa chỉ nhận hàng')}
          />
          <SettingsItem
            icon={ICONS.voucher}
            title="Vé & Mã ưu đãi (Voucher)"
            valueBadge={voucherCount > 0 ? `${voucherCount} mã có sẵn` : '0 mã'}
            onPress={() => showUpcomingFeature('Vé & Mã ưu đãi')}
          />
          <SettingsItem
            icon={ICONS.bag}
            title="Lịch sử đơn hàng"
            value={`${activeOrdersCount} đang giao`}
            onPress={() => (user ? navigation.navigate('Orders') : navigation.navigate('Auth'))}
          />
          <SettingsItem
            icon={ICONS.card}
            title="Phương thức thanh toán"
            value={paymentMethodLabel}
            onPress={() => showUpcomingFeature('Phương thức thanh toán')}
          />
          <SettingsItem
            icon={ICONS.userBadge}
            title="Thông tin tài khoản"
            onPress={() => (user ? setEditModalVisible(true) : navigation.navigate('Auth'))}
            isLast={true}
          />
        </SectionGroup>


        <SectionGroup title="TÙY CHỌN ỨNG DỤNG">
          <SettingsItem
            icon={ICONS.bell}
            title="Thông báo đẩy"
            subtitle="Bộ sưu tập mới & flash deal"
            isSwitch={true}
            switchValue={pushNotifications}
            onSwitchChange={setPushNotifications}
          />
          <SettingsItem
            icon={ICONS.globe}
            title="Ngôn ngữ hiển thị"
            valueBadge="Tiếng Việt (VI)"
            onPress={() => showUpcomingFeature('Ngôn ngữ hiển thị')}
          />
          <SettingsItem
            icon={ICONS.moon}
            title="Giao diện tối"
            isSwitch={true}
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
          <SettingsItem
            icon={ICONS.chart}
            title="Gợi ý kích cỡ thông minh"
            subtitle="Tự động chọn size vừa vặn FITZY Fit"
            isSwitch={true}
            switchValue={smartSize}
            onSwitchChange={v => {
              setSmartSize(v);
              if (v) navigation.navigate('Stylist');
            }}
            isLast={true}
          />
        </SectionGroup>


        <SectionGroup title="HỖ TRỢ & PHÁP LÝ">
          <SettingsItem
            icon={ICONS.chat}
            title="Trung tâm trợ giúp & CSKH 24/7"
            onPress={() => showUpcomingFeature('Trung tâm CSKH 24/7')}
          />
          <SettingsItem
            icon={ICONS.shield}
            title="Chính sách bảo mật dữ liệu"
            onPress={() => showUpcomingFeature('Chính sách bảo mật dữ liệu')}
          />
          <SettingsItem
            icon={ICONS.doc}
            title="Điều khoản dịch vụ"
            onPress={() => showUpcomingFeature('Điều khoản dịch vụ')}
          />
          <SettingsItem
            icon={ICONS.info}
            title="Phiên bản ứng dụng"
            value="v1.0.0 (Build 2025)"
            showChevron={false}
            onPress={() =>
              Alert.alert(
                'FITZY Minimalist Apparel',
                'Phiên bản v1.0.0 (Build 2025)\nCập nhật thiết kế cao cấp mới nhất.'
              )
            }
            isLast={true}
          />
        </SectionGroup>

        {/* Logout Button */}
        {user ? (
          <Pressable
            accessibilityRole="button"
            onPress={logout}
            style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}
          >
            <Image source={{ uri: ICONS.logout }} style={styles.logoutIcon} resizeMode="contain" />
            <Text style={styles.logoutText}>ĐĂNG XUẤT TÀI KHOẢN</Text>
          </Pressable>
        ) : null}


        <Text style={styles.footerText}>FITZY STUDIO © 2025 • MINIMALIST APPAREL</Text>
      </ScrollView>


      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thông tin cá nhân</Text>
              <Pressable
                onPress={() => setEditModalVisible(false)}
                hitSlop={10}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalFieldLabel}>Email đăng ký</Text>
                <View style={[styles.modalInputBox, { backgroundColor: '#f4f2ee' }]}>
                  <Text style={{ color: theme.colors.muted }}>{user?.email || ''}</Text>
                </View>
              </View>

              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalFieldLabel}>Họ và tên</Text>
                <View style={styles.modalInputBox}>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Nhập họ và tên"
                    placeholderTextColor="#aaa69f"
                    style={styles.modalTextInput}
                  />
                </View>
              </View>

              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalFieldLabel}>Số điện thoại</Text>
                <View style={styles.modalInputBox}>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Nhập số điện thoại"
                    placeholderTextColor="#aaa69f"
                    keyboardType="phone-pad"
                    style={styles.modalTextInput}
                  />
                </View>
              </View>

              {error ? <Text style={styles.modalErrorText}>{error}</Text> : null}

              <Pressable
                onPress={save}
                disabled={busy}
                style={[styles.modalSaveBtn, busy && { opacity: 0.7 }]}
              >
                {busy ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.modalSaveText}>LƯU THAY ĐỔI</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  headerBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: theme.colors.paper,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackArrow: {
    fontSize: 32,
    color: theme.colors.ink,
    lineHeight: 34,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.ink,
    letterSpacing: 1.5,
  },
  headerSearchIcon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.ink,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ece8e1',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ede9e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.ink,
    letterSpacing: 0.5,
  },
  avatarBadgeOuter: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.ink,
  },
  userInfoWrapper: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  userEmail: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 2,
    marginBottom: 6,
  },
  vipPill: {
    backgroundColor: '#f4f2ee',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e1d8',
  },
  vipPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.ink,
    letterSpacing: 0.8,
  },
  guestLoginBtn: {
    marginTop: 6,
    backgroundColor: theme.colors.ink,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  guestLoginText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  vipBanner: {
    backgroundColor: '#141414',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },
  vipBannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  vipBannerTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1.2,
  },
  vipCodeBadge: {
    backgroundColor: '#262626',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  vipCodeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  vipBannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  vipBannerDesc: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 18,
    marginBottom: 14,
  },
  vipBannerBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipBannerBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.5,
  },
  sectionContainer: {
    marginBottom: 22,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777570',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ece8e1',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f4f2ee',
  },
  itemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f6f4f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIcon: {
    width: 20,
    height: 20,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  itemSubtitle: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  itemRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgePill: {
    backgroundColor: '#f4f2ee',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
  },
  badgePillText: {
    fontSize: 11,
    color: theme.colors.ink,
    fontWeight: '600',
  },
  itemValueText: {
    fontSize: 13,
    color: theme.colors.muted,
    marginRight: 6,
  },
  chevronText: {
    fontSize: 20,
    color: '#aaa69f',
    lineHeight: 22,
    fontWeight: '300',
  },
  logoutBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ece8e1',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoutIcon: {
    width: 18,
    height: 18,
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.8,
    marginLeft: 8,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#aaa69f',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f4f2ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    color: theme.colors.ink,
    fontWeight: '600',
  },
  modalBody: {
    gap: 14,
  },
  modalFieldGroup: {
    gap: 6,
  },
  modalFieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  modalInputBox: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  modalTextInput: {
    fontSize: 14,
    color: theme.colors.ink,
    paddingVertical: 0,
  },
  modalErrorText: {
    color: theme.colors.danger,
    fontSize: 13,
  },
  modalSaveBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: theme.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalSaveText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
